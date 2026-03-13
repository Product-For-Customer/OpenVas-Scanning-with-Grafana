package services

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/chromedp/chromedp"
)

func CaptureFrontendReportPage() (string, error) {
	targetURL := os.Getenv("FRONTEND_CAPTURE_URL")
	if targetURL == "" {
		targetURL = "http://frontend/capture"
	}

	outputDir := os.Getenv("REPORT_OUTPUT_DIR")
	if outputDir == "" {
		outputDir = "./tmp/reports"
	}

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return "", fmt.Errorf("create output dir failed: %w", err)
	}

	chromePath := os.Getenv("CHROME_PATH")

	fileName := fmt.Sprintf("capture-report-%s.png", time.Now().Format("2006-01-02_15-04-05"))
	filePath := filepath.Join(outputDir, fileName)

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("hide-scrollbars", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.WindowSize(1600, 900),
	)

	if chromePath != "" {
		opts = append(opts, chromedp.ExecPath(chromePath))
	}

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 360*time.Second)
	defer cancel()

	var buf []byte

	err := chromedp.Run(ctx,
		chromedp.Navigate(targetURL),
		chromedp.WaitVisible(`#capture-root`, chromedp.ByID),
		chromedp.Sleep(2*time.Second),
		chromedp.FullScreenshot(&buf, 95),
	)
	if err != nil {
		return "", fmt.Errorf("capture screenshot failed (url=%s): %w", targetURL, err)
	}

	if err := os.WriteFile(filePath, buf, 0644); err != nil {
		return "", fmt.Errorf("write screenshot file failed: %w", err)
	}

	return filePath, nil
}