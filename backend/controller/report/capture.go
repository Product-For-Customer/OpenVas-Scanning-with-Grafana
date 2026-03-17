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

	publicURL, err := services.BuildReportPublicURL(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":     "build public url failed",
			"details":   err.Error(),
			"file_path": filePath,
		})
		return
	}

	if err := services.SendReportToLINE(filePath, publicURL); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":      "line send failed",
			"details":    err.Error(),
			"file_path":  filePath,
			"public_url": publicURL,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "capture and line send success",
		"file_path":  filePath,
		"public_url": publicURL,
	})
}