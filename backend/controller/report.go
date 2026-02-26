package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ReportRow struct {
	Host       string  `json:"host"`
	Hostname   string  `json:"hostname"`
	Severity   string  `json:"severity"`
	Count      int     `json:"count"`
	Score      float64 `json:"score"`
	DetectedAt string  `json:"detected_at"`
	TaskName   string  `json:"task_name"`
}

type ReportResponse struct {
	Success   bool        `json:"success"`
	Source    string      `json:"source"`
	Generated string      `json:"generated_at"`
	Count     int         `json:"count"`
	Data      []ReportRow `json:"data"`
}

// GetReportCSVSourceHandler
// ใช้สำหรับให้ n8n ดึงข้อมูลไปสร้าง CSV
// ตัวอย่าง:
//   GET /api/report
//   GET /api/report?limit=10
//   GET /api/report?onlyHigh=true
func GetReportCSVSourceHandler(c *gin.Context) {
	// -----------------------------
	// Query params (optional)
	// -----------------------------
	limitStr := c.DefaultQuery("limit", "100")
	onlyHighStr := c.DefaultQuery("onlyHigh", "false")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 100
	}

	onlyHigh := false
	if onlyHighStr == "true" || onlyHighStr == "1" {
		onlyHigh = true
	}

	now := time.Now().UTC().Format(time.RFC3339)

	// -----------------------------
	// Mock data (เริ่มต้นให้ n8n ใช้งานได้ก่อน)
	// ภายหลังค่อยเปลี่ยนเป็น query DB จริง
	// -----------------------------
	allRows := []ReportRow{
		{
			Host:       "192.168.1.10",
			Hostname:   "server-a",
			Severity:   "High",
			Count:      12,
			Score:      8.9,
			DetectedAt: now,
			TaskName:   "Weekly Internal Scan",
		},
		{
			Host:       "192.168.1.20",
			Hostname:   "server-b",
			Severity:   "Medium",
			Count:      5,
			Score:      5.6,
			DetectedAt: now,
			TaskName:   "Weekly Internal Scan",
		},
		{
			Host:       "192.168.1.30",
			Hostname:   "printer-room",
			Severity:   "Low",
			Count:      2,
			Score:      2.1,
			DetectedAt: now,
			TaskName:   "Weekly Internal Scan",
		},
		{
			Host:       "192.168.1.40",
			Hostname:   "db-server",
			Severity:   "Critical",
			Count:      4,
			Score:      9.8,
			DetectedAt: now,
			TaskName:   "Weekly Internal Scan",
		},
	}

	// Filter
	filtered := make([]ReportRow, 0, len(allRows))
	for _, row := range allRows {
		if onlyHigh {
			if row.Severity == "High" || row.Severity == "Critical" {
				filtered = append(filtered, row)
			}
			continue
		}
		filtered = append(filtered, row)
	}

	// Limit
	if limit < len(filtered) {
		filtered = filtered[:limit]
	}

	// -----------------------------
	// IMPORTANT:
	// n8n Spreadsheet node มักทำงานง่ายสุดถ้าได้ "array ตรง ๆ"
	// ดังนั้นเราจะรองรับ 2 format:
	// 1) default -> array (เหมาะกับ n8n)
	// 2) ?wrap=true -> object แบบมี metadata
	// -----------------------------
	wrap := c.DefaultQuery("wrap", "false")
	if wrap == "true" || wrap == "1" {
		c.JSON(http.StatusOK, ReportResponse{
			Success:   true,
			Source:    "mock",
			Generated: now,
			Count:     len(filtered),
			Data:      filtered,
		})
		return
	}

	// ✅ Default: ส่ง array ตรง ๆ ให้ n8n แปลง CSV ง่ายที่สุด
	c.JSON(http.StatusOK, filtered)
}