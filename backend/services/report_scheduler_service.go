package services

import (
	"log"
	"os"
	"strconv"
	"time"
)

func envInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	n, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return n
}

func StartCaptureReportScheduler() {
	hour := envInt("REPORT_SCHEDULE_HOUR", 2)
	minute := envInt("REPORT_SCHEDULE_MINUTE", 0)

	go func() {
		for {
			now := time.Now()
			nextRun := time.Date(
				now.Year(),
				now.Month(),
				now.Day(),
				hour,
				minute,
				0,
				0,
				now.Location(),
			)

			if !nextRun.After(now) {
				nextRun = nextRun.Add(24 * time.Hour)
			}

			waitDuration := time.Until(nextRun)
			log.Printf("[capture-report] next run at %s (in %s)", nextRun.Format(time.RFC3339), waitDuration)

			time.Sleep(waitDuration)

			log.Println("[capture-report] started")

			filePath, err := CaptureFrontendReportPage()
			if err != nil {
				log.Printf("[capture-report] capture failed: %v", err)
				time.Sleep(2 * time.Second)
				continue
			}

			if err := SendReportEmailWithAttachment(filePath); err != nil {
				log.Printf("[capture-report] email failed: %v", err)
				time.Sleep(2 * time.Second)
				continue
			}

			log.Printf("[capture-report] success: %s", filePath)
			time.Sleep(2 * time.Second)
		}
	}()
}