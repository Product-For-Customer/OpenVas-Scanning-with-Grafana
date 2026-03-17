package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type linePushRequest struct {
	To       string        `json:"to"`
	Messages []lineMessage `json:"messages"`
}

type lineMessage struct {
	Type               string `json:"type"`
	Text               string `json:"text,omitempty"`
	OriginalContentURL string `json:"originalContentUrl,omitempty"`
	PreviewImageURL    string `json:"previewImageUrl,omitempty"`
}

func SendReportToLINE(filePath string, publicURL string) error {
	channelToken := os.Getenv("LINE_CHANNEL_ACCESS_TOKEN")
	userID := os.Getenv("LINE_USER_ID")

	if channelToken == "" || userID == "" {
		return fmt.Errorf("LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID is empty")
	}

	text := fmt.Sprintf(
		"รายงาน OpenVAS ถูกสร้างแล้ว\nเวลา: %s\nไฟล์: %s",
		time.Now().Format("2006-01-02 15:04:05"),
		filePath,
	)

	payload := linePushRequest{
		To: userID,
		Messages: []lineMessage{
			{
				Type: "text",
				Text: text,
			},
			{
				Type:               "image",
				OriginalContentURL: publicURL,
				PreviewImageURL:    publicURL,
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal line payload failed: %w", err)
	}

	req, err := http.NewRequest(
		http.MethodPost,
		"https://api.line.me/v2/bot/message/push",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return fmt.Errorf("create line request failed: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+channelToken)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("call line api failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("line api returned status: %s", resp.Status)
	}

	return nil
}