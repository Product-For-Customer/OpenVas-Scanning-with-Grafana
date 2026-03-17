package services

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func BuildReportPublicURL(filePath string) (string, error) {
	baseURL := strings.TrimRight(os.Getenv("REPORT_PUBLIC_BASE_URL"), "/")
	if baseURL == "" {
		return "", fmt.Errorf("REPORT_PUBLIC_BASE_URL is empty")
	}

	fileName := filepath.Base(filePath)
	return baseURL + "/" + fileName, nil
}