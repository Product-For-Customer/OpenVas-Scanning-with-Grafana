package controller

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/lib/pq"
)

// =====================================================
// ENV Helpers
// =====================================================

func getPGConnString() string {
	// ใช้ DATABASE_URL จาก docker-compose/.env ก่อน
	// ตัวอย่าง:
	// DATABASE_URL=host=pg-gvm port=5432 user=pbi password=Pbi12345 dbname=gvmd sslmode=disable
	dsn := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if dsn != "" {
		return dsn
	}

	// fallback สำหรับ dev/local
	return "host=pg-gvm port=5432 user=pbi password=Pbi12345 dbname=gvmd sslmode=disable"
}

func getLineToken() string {
	// รองรับหลายชื่อ env เผื่อคุณเปลี่ยนภายหลัง
	if v := strings.TrimSpace(os.Getenv("LINE_CHANNEL_ACCESS_TOKEN")); v != "" {
		return v
	}
	if v := strings.TrimSpace(os.Getenv("LINE_ACCESS_TOKEN")); v != "" {
		return v
	}
	return ""
}

func getLineDefaultTo() string {
	// userId / groupId / roomId
	if v := strings.TrimSpace(os.Getenv("LINE_USER_ID")); v != "" {
		return v
	}
	if v := strings.TrimSpace(os.Getenv("LINE_DEFAULT_TO")); v != "" {
		return v
	}
	return ""
}

// =====================================================
// LINE Push API
// =====================================================

type lineTextMessage struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type linePushRequest struct {
	To       string            `json:"to"`
	Messages []lineTextMessage `json:"messages"`
}

func sendLinePush(message string) error {
	token := getLineToken()
	to := getLineDefaultTo()

	if token == "" {
		return fmt.Errorf("LINE token is empty (set LINE_CHANNEL_ACCESS_TOKEN)")
	}
	if to == "" {
		return fmt.Errorf("LINE destination is empty (set LINE_USER_ID or LINE_DEFAULT_TO)")
	}

	url := "https://api.line.me/v2/bot/message/push"

	payload := linePushRequest{
		To: to,
		Messages: []lineTextMessage{
			{
				Type: "text",
				Text: message,
			},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("line marshal error: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("line request create error: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("line send error: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("line send failed: status=%s response=%s", resp.Status, string(body))
	}

	log.Println("✅ LINE Sent:", resp.Status, "Response:", string(body))
	return nil
}

// =====================================================
// PostgreSQL Ready Wait (for pq listener)
// =====================================================

func waitPGReadyForListener(connStr string) {
	for {
		db, err := sql.Open("postgres", connStr)
		if err == nil {
			db.SetConnMaxLifetime(0)
			db.SetMaxOpenConns(1)
			db.SetMaxIdleConns(1)

			if err2 := db.Ping(); err2 == nil {
				_ = db.Close()
				log.Println("✅ PostgreSQL ready for LINE listener")
				return
			}
			_ = db.Close()
		}

		log.Println("⏳ PostgreSQL not ready for LINE listener... retry in 2s")
		time.Sleep(2 * time.Second)
	}
}

// =====================================================
// Scan Notify Payload / Formatting
// =====================================================

func fallbackStatusFromChannel(ch string) string {
	switch ch {
	case "scan_started":
		return "Running"
	case "scan_stopped":
		return "Stopped"
	case "scan_done":
		return "Done"
	default:
		return "Unknown"
	}
}

func buildScanStatusLineMessage(channel string, rawPayload string) (string, error) {
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(rawPayload), &data); err != nil {
		return "", fmt.Errorf("json parse error: %w", err)
	}

	taskName, _ := data["task_name"].(string)
	if strings.TrimSpace(taskName) == "" {
		taskName = "Unknown"
	}

	statusText, ok := data["status"].(string)
	if !ok || strings.TrimSpace(statusText) == "" {
		statusText = fallbackStatusFromChannel(channel)
	}

	emoji := "ℹ️"
	title := "OpenVAS Scan Update"

	switch channel {
	case "scan_started":
		emoji = "🚀"
		title = "OpenVAS Scan Started"
	case "scan_stopped":
		emoji = "🛑"
		title = "OpenVAS Scan Stopped"
	case "scan_done":
		emoji = "✅"
		title = "OpenVAS Scan Done"
	}

	msg := fmt.Sprintf("%s %s\nTask: %s\nStatus: %s", emoji, title, taskName, statusText)
	return msg, nil
}

// =====================================================
// Public Function: Start background PG LISTEN -> LINE
// เรียกจาก main.go ด้วย go controllers.StartLineStatusListener()
// =====================================================

func StartLineStatusListener() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)

	connStr := getPGConnString()
	waitPGReadyForListener(connStr)

	eventCallback := func(ev pq.ListenerEventType, err error) {
		if err != nil {
			log.Println("⚠️ PG Listener event:", ev, "error:", err)
			return
		}
		log.Println("PG Listener event:", ev)
	}

	listener := pq.NewListener(connStr, 5*time.Second, 30*time.Second, eventCallback)

	// LISTEN channels ตาม trigger SQL ของคุณ
	if err := listener.Listen("scan_started"); err != nil {
		log.Println("❌ LISTEN scan_started failed:", err)
		return
	}
	if err := listener.Listen("scan_stopped"); err != nil {
		log.Println("❌ LISTEN scan_stopped failed:", err)
		return
	}
	if err := listener.Listen("scan_done"); err != nil {
		log.Println("❌ LISTEN scan_done failed:", err)
		return
	}

	log.Println("✅ LISTEN scan_started / scan_stopped / scan_done OK")
	log.Println("✅ Waiting for scan events...")

	for {
		select {
		case n := <-listener.Notify:
			if n == nil {
				continue
			}

			log.Println("📩 Notify received channel:", n.Channel, "payload:", n.Extra)

			message, err := buildScanStatusLineMessage(n.Channel, n.Extra)
			if err != nil {
				log.Println("❌ buildScanStatusLineMessage error:", err, "raw:", n.Extra)
				continue
			}

			if err := sendLinePush(message); err != nil {
				log.Println("❌ sendLinePush error:", err)
				continue
			}

		case <-time.After(60 * time.Second):
			// keep alive
			if err := listener.Ping(); err != nil {
				log.Println("⚠️ listener.Ping error:", err)
			}
		}
	}
}

// =====================================================
// Optional HTTP Endpoint for testing LINE push
// GET /line/test?message=hello
// =====================================================

func TestSendLineHandler(c *gin.Context) {
	message := strings.TrimSpace(c.Query("message"))
	if message == "" {
		message = "✅ Test message from OpenVAS backend"
	}

	if err := sendLinePush(message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "LINE message sent",
		"data": gin.H{
			"text": message,
		},
	})
}