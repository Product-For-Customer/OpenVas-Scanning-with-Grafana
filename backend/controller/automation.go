package controller

import (
	"bytes"
	"context"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type FeedUpdateRequest struct {
	TriggeredBy string `json:"triggered_by"`
	Source      string `json:"source"`
	Force       bool   `json:"force"`
}

type FeedUpdateStatus struct {
	IsRunning   bool      `json:"is_running"`
	LastStatus  string    `json:"last_status"`
	LastMessage string    `json:"last_message"`
	LastRunAt   time.Time `json:"last_run_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	LastOutput  string    `json:"last_output,omitempty"`
	ResultType  string    `json:"result_type,omitempty"` // added
	Updated     bool      `json:"updated"`               // added
}

var feedUpdateMu sync.Mutex
var isFeedUpdating bool

var feedStatus = FeedUpdateStatus{
	IsRunning:   false,
	LastStatus:  "idle",
	LastMessage: "server started",
	LastRunAt:   time.Time{},
	UpdatedAt:   time.Now(),
	ResultType:  "idle",
	Updated:     false,
}

func TriggerFeedUpdateHandler(c *gin.Context) {
	// ✅ ตรวจ token จาก header
	requiredToken := os.Getenv("AUTOMATION_TOKEN")
	gotToken := c.GetHeader("X-Automation-Token")

	if requiredToken == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success":      false,
			"updated":      false,
			"result_type":  "server_error",
			"message":      "AUTOMATION_TOKEN is not configured in backend environment",
			"error":        "AUTOMATION_TOKEN is not configured in backend environment",
			"triggered_by": "unknown",
			"source":       "unknown",
			"at":           time.Now().Format(time.RFC3339),
		})
		return
	}

	if gotToken == "" || gotToken != requiredToken {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success":      false,
			"updated":      false,
			"result_type":  "unauthorized",
			"message":      "invalid automation token",
			"error":        "invalid automation token",
			"triggered_by": "unknown",
			"source":       "unknown",
			"at":           time.Now().Format(time.RFC3339),
		})
		return
	}

	// ✅ รับ JSON body (optional)
	var req FeedUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req = FeedUpdateRequest{
			TriggeredBy: "unknown",
			Source:      "unknown",
			Force:       false,
		}
	}
	if req.TriggeredBy == "" {
		req.TriggeredBy = "unknown"
	}
	if req.Source == "" {
		req.Source = "unknown"
	}

	// ✅ Lock กันรันซ้ำ
	feedUpdateMu.Lock()
	if isFeedUpdating {
		feedStatus.IsRunning = false
		feedStatus.LastStatus = "busy"
		feedStatus.LastMessage = "feed update is already running"
		feedStatus.ResultType = "already_running"
		feedStatus.Updated = false
		feedStatus.UpdatedAt = time.Now()
		feedUpdateMu.Unlock()

		c.JSON(http.StatusConflict, gin.H{
			"success":      false,
			"updated":      false,
			"result_type":  "already_running",
			"message":      "feed update is already running",
			"error":        "feed update is already running",
			"triggered_by": req.TriggeredBy,
			"source":       req.Source,
			"force":        req.Force,
			"at":           time.Now().Format(time.RFC3339),
		})
		return
	}

	isFeedUpdating = true
	feedStatus.IsRunning = true
	feedStatus.LastStatus = "running"
	feedStatus.LastMessage = "feed update started"
	feedStatus.LastRunAt = time.Now()
	feedStatus.UpdatedAt = time.Now()
	feedStatus.LastOutput = ""
	feedStatus.ResultType = "running"
	feedStatus.Updated = false
	feedUpdateMu.Unlock()

	// ปล่อยสถานะตอนจบ
	defer func() {
		feedUpdateMu.Lock()
		isFeedUpdating = false
		feedStatus.IsRunning = false
		feedStatus.UpdatedAt = time.Now()
		feedUpdateMu.Unlock()
	}()

	// =========================
	// PRODUCTION MODE: run script จริง
	// =========================
	scriptPath := "/app/scripts/update-feed.sh"

	// timeout กันค้าง
	ctx, cancel := context.WithTimeout(context.Background(), 65*time.Minute)
	defer cancel()

	cmd := exec.CommandContext(ctx, "bash", scriptPath)

	// ส่ง env เพิ่มเติมได้
	cmd.Env = append(os.Environ(),
		"OPENVAS_COMPOSE_WORKDIR="+getEnv("OPENVAS_COMPOSE_WORKDIR", "/workspace"),
	)

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	combinedOutput := stdout.String()
	if stderr.Len() > 0 {
		if combinedOutput != "" {
			combinedOutput += "\n"
		}
		combinedOutput += stderr.String()
	}

	// จำกัดขนาด output กัน JSON ใหญ่เกิน
	const maxOutput = 4000
	if len(combinedOutput) > maxOutput {
		combinedOutput = combinedOutput[len(combinedOutput)-maxOutput:]
	}

	// parse result type from script markers
	parsedResultType, parsedUpdated := parseFeedUpdateResult(combinedOutput)

	feedUpdateMu.Lock()
	defer feedUpdateMu.Unlock()

	if ctx.Err() == context.DeadlineExceeded {
		feedStatus.LastStatus = "timeout"
		feedStatus.LastMessage = "feed update timeout"
		feedStatus.LastOutput = combinedOutput
		feedStatus.ResultType = "timeout"
		feedStatus.Updated = false
		feedStatus.UpdatedAt = time.Now()

		c.JSON(http.StatusGatewayTimeout, gin.H{
			"success":      false,
			"updated":      false,
			"result_type":  "timeout",
			"message":      "feed update timeout",
			"error":        "feed update timeout",
			"triggered_by": req.TriggeredBy,
			"source":       req.Source,
			"force":        req.Force,
			"at":           time.Now().Format(time.RFC3339),
			"output":       combinedOutput,
		})
		return
	}

	if err != nil {
		feedStatus.LastStatus = "failed"
		feedStatus.LastMessage = "feed update failed: " + err.Error()
		feedStatus.LastOutput = combinedOutput
		feedStatus.ResultType = "failed"
		feedStatus.Updated = false
		feedStatus.UpdatedAt = time.Now()

		c.JSON(http.StatusInternalServerError, gin.H{
			"success":      false,
			"updated":      false,
			"result_type":  "failed",
			"message":      "feed update failed",
			"error":        "feed update failed",
			"detail":       err.Error(),
			"triggered_by": req.TriggeredBy,
			"source":       req.Source,
			"force":        req.Force,
			"at":           time.Now().Format(time.RFC3339),
			"output":       combinedOutput,
		})
		return
	}

	// success path but distinguish updated/no_update
	feedStatus.LastStatus = "success"
	feedStatus.LastOutput = combinedOutput
	feedStatus.ResultType = parsedResultType
	feedStatus.Updated = parsedUpdated
	feedStatus.UpdatedAt = time.Now()

	if parsedResultType == "no_update" {
		feedStatus.LastMessage = "no new feed updates found"

		c.JSON(http.StatusOK, gin.H{
			"success":      true,
			"updated":      false,
			"result_type":  "no_update",
			"message":      "no new feed updates found",
			"triggered_by": req.TriggeredBy,
			"source":       req.Source,
			"force":        req.Force,
			"at":           time.Now().Format(time.RFC3339),
			"output":       combinedOutput,
		})
		return
	}

	feedStatus.LastMessage = "feed update completed successfully"

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"updated":      true,
		"result_type":  "updated",
		"message":      "feed update completed successfully",
		"triggered_by": req.TriggeredBy,
		"source":       req.Source,
		"force":        req.Force,
		"at":           time.Now().Format(time.RFC3339),
		"output":       combinedOutput,
	})
}

func GetFeedUpdateStatusHandler(c *gin.Context) {
	feedUpdateMu.Lock()
	statusCopy := feedStatus
	feedUpdateMu.Unlock()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    statusCopy,
	})
}

func parseFeedUpdateResult(output string) (resultType string, updated bool) {
	lower := strings.ToLower(output)

	// Priority 1: explicit markers from script (เชื่อ marker เป็นหลัก)
	if strings.Contains(lower, "result_type=no_update") {
		return "no_update", false
	}
	if strings.Contains(lower, "result_type=updated") {
		return "updated", true
	}
	if strings.Contains(lower, "result_type=failed") {
		return "failed", false
	}

	// Fallback heuristic (conservative)
	if strings.Contains(lower, "downloaded newer image") {
		return "updated", true
	}
	if strings.Contains(lower, "no new feed updates found") ||
		strings.Contains(lower, "image is up to date") ||
		strings.Contains(lower, "up to date") {
		return "no_update", false
	}

	// default ลด false positive
	return "no_update", false
}

func getEnv(key, fallback string) string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	return v
}