package report

import (
	"net/http"

	"github.com/Tawunchai/openvas/services"
	"github.com/gin-gonic/gin"
)

func TriggerCaptureAndSendReport(c *gin.Context) {
	filePath, err := services.CaptureFrontendReportPage()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "capture failed",
			"details": err.Error(),
		})
		return
	}

	if err := services.SendReportEmailWithAttachment(filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":     "email send failed",
			"details":   err.Error(),
			"file_path": filePath,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "capture and email success",
		"file_path": filePath,
	})
}