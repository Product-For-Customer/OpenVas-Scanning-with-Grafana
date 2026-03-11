package line

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/gin-gonic/gin"
)

type TestLineNotifyByAppNotificationIDRequest struct {
	AppNotificationID uint   `json:"app_notification_id" binding:"required"`
	Message           string `json:"message" binding:"required"`
}

type linePushTextMessage struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type linePushByTokenRequest struct {
	To       string                `json:"to"`
	Messages []linePushTextMessage `json:"messages"`
}

func sendLinePushWithToken(token string, to string, message string) error {
	token = strings.TrimSpace(token)
	to = strings.TrimSpace(to)
	message = strings.TrimSpace(message)

	if token == "" {
		return fmt.Errorf("LINE token is empty")
	}
	if to == "" {
		return fmt.Errorf("LINE destination is empty")
	}
	if message == "" {
		return fmt.Errorf("message is empty")
	}

	url := "https://api.line.me/v2/bot/message/push"

	payload := linePushByTokenRequest{
		To: to,
		Messages: []linePushTextMessage{
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

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("line request create error: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("line send error: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("line send failed: status=%s response=%s", resp.Status, string(body))
	}

	return nil
}

func TestLineNotifyByAppNotificationID(c *gin.Context) {
	var req TestLineNotifyByAppNotificationIDRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "invalid request body",
			"error":   err.Error(),
		})
		return
	}

	req.Message = strings.TrimSpace(req.Message)
	if req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "message is required",
		})
		return
	}

	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "database connection is nil",
		})
		return
	}

	var appNotification entity.AppNotification
	if err := db.Preload("AppLineMaster").
		First(&appNotification, req.AppNotificationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "app notification not found",
			"error":   err.Error(),
		})
		return
	}

	if strings.TrimSpace(appNotification.SendID) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "send_id is empty in app notification",
		})
		return
	}

	if appNotification.AppLineMaster == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "app line master not found for this notification",
		})
		return
	}

	if !appNotification.Alert {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "line alert is disabled for this notification",
			"data": gin.H{
				"app_notification_id": appNotification.ID,
				"name":                appNotification.Name,
				"send_id":             appNotification.SendID,
				"alert":               appNotification.Alert,
				"app_line_master_id":  appNotification.AppLineMasterID,
				"line_master_name":    appNotification.AppLineMaster.Name,
				"text":                req.Message,
			},
		})
		return
	}

	lineToken := strings.TrimSpace(appNotification.AppLineMaster.Token)
	if lineToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "line token is empty in app line master",
		})
		return
	}

	if err := sendLinePushWithToken(lineToken, appNotification.SendID, req.Message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "failed to send line message",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "line message sent successfully",
		"data": gin.H{
			"app_notification_id": appNotification.ID,
			"name":                appNotification.Name,
			"send_id":             appNotification.SendID,
			"alert":               appNotification.Alert,
			"app_line_master_id":  appNotification.AppLineMasterID,
			"line_master_name":    appNotification.AppLineMaster.Name,
			"text":                req.Message,
		},
	})
}