package main

import (
	"log"
	"net/http"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/controller"
	"github.com/Tawunchai/openvas/controller/vulnerability"
	middlewares "github.com/Tawunchai/openvas/middleware"
	"github.com/gin-gonic/gin"
)

const PORT = "9000"

func main() {
	config.ConnectDB()
	config.SetupDatabase()
	config.SeedDatabase()

	// ✅ เริ่ม background listener สำหรับ LINE status
	go controller.StartLineStatusListener()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// Health check
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	r.GET("/line/test", controller.TestSendLineHandler)
	r.POST("/automation/feed/update", controller.TriggerFeedUpdateHandler)
	r.GET("/automation/feed/status", controller.GetFeedUpdateStatusHandler)
	r.GET("/api/report", controller.GetReportCSVSourceHandler)

	// Service API with Frontend
	r.GET("/tasks/status", vulnerability.ListStatus)
	r.GET("/tasks/summary-vulnerability", vulnerability.ListTaskVulnSummary)
	r.GET("/vulnerabilities/list", vulnerability.ListVulnerability)
	r.GET("/assets/risk", vulnerability.ListAssetRisk)
	r.GET("/devices/risk", vulnerability.ListDeviceRisk)
	r.GET("/vulnerabilities/detail/by-name", vulnerability.ListVulnerabilityDetailByName)
	r.GET("/vulnerabilities/:task_id", vulnerability.ListVulnerabilityByTaskID)

	// Protected routes
	authorized := r.Group("")
	authorized.Use(middlewares.Authorizes())
	{
		// ใส่ route ที่ต้อง auth ตรงนี้
	}

	log.Printf("✅ Server starting on port %s\n", PORT)

	if err := r.Run(":" + PORT); err != nil {
		log.Fatalf("❌ Failed to run server: %v", err)
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		allowedOrigins := map[string]bool{
			"http://localhost:5173":            true,
			"http://127.0.0.1:5173":            true,
			"http://localhost:3000":            true,
			"http://127.0.0.1:3000":            true,
			"https://openvaswebv1.vercel.app":  true,
		}

		if allowedOrigins[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Vary", "Origin")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Automation-Token, ngrok-skip-browser-warning",
		)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}