package main

import (
	"log"
	"net/http"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/controller/auth"
	"github.com/Tawunchai/openvas/controller/automation"
	"github.com/Tawunchai/openvas/controller/line"
	"github.com/Tawunchai/openvas/controller/otp"
	"github.com/Tawunchai/openvas/controller/report"
	"github.com/Tawunchai/openvas/controller/user"
	"github.com/Tawunchai/openvas/controller/vulnerability"
	middlewares "github.com/Tawunchai/openvas/middleware"
	"github.com/gin-gonic/gin"
)

const PORT = "9000"

func main() {
	config.ConnectDB()
	config.SetupDatabase()
	config.SeedDatabase()

	go line.StartLineStatusListener()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// ===== Public Auth Routes =====
	r.POST("/auth/login", auth.Login)
	r.POST("/send-otp-signup", auth.SendOTPForSignUp)
	r.POST("/verify-otp-signup", auth.VerifyOTPSignUp)
	r.POST("/check-user-email", auth.CheckUserEmail)
	r.POST("/send-otp", otp.SendOTP)
	r.POST("/verify-otp-password", otp.VerifyOTPAddUpdatePassword)
	r.POST("/auth/logout", auth.Logout)

	r.POST("/create-users", user.CreateUser)
	r.GET("/roles", user.ListRoles)
	r.PATCH("/admin/users/:id", user.UpdateUserIDByAdmin)

	r.GET("/send-emails", otp.ListSendEmail)
	r.PUT("/send-email/:id", otp.UpdateSendEmailByID)

	// ===== Public Routes =====
	r.GET("/line/test", line.TestSendLineHandler)
	r.POST("/automation/feed/update", automation.TriggerFeedUpdateHandler)
	r.GET("/automation/feed/status", automation.GetFeedUpdateStatusHandler)
	r.GET("/api/report", report.GetReportCSVSourceHandler)

	// Service API with Frontend
	r.GET("/tasks/status", vulnerability.ListStatus)                                      //
	r.GET("/tasks/summary-vulnerability", vulnerability.ListTaskVulnSummary)              //
	r.GET("/vulnerabilities/list", vulnerability.ListVulnerability)                       //
	r.GET("/assets/risk", vulnerability.ListAssetRisk)                                    //
	r.GET("/devices/risk", vulnerability.ListDeviceRisk)                                  //
	r.GET("/vulnerabilities/detail/by-name", vulnerability.ListVulnerabilityDetailByName) //
	r.GET("/vulnerabilities/:task_id", vulnerability.ListVulnerabilityByTaskID)           //
	r.GET("/target-differ", vulnerability.ListTargetDiffer)

	// ===== Protected Routes =====
	authorized := r.Group("")
	authorized.Use(middlewares.Authorizes())
	{
		authorized.GET("/auth/me", auth.Me)
		authorized.GET("/users", user.ListUser)
		authorized.GET("/users/:id", user.ListUserByID)
		authorized.PATCH("/update-users/:id", user.UpdateUserByID)
		authorized.DELETE("/delete-users/:id", user.DeleteUserByID)
		authorized.GET("/history-notifies", line.ListHistoryNotify)
		authorized.DELETE("/delete-history-notifies", line.DeleteHistoryNotifyByIDs)
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
			"http://localhost:5174":           true,
			"http://127.0.0.1:5174":           true,
			"http://localhost:5173":           true,
			"http://127.0.0.1:5173":           true,
			"http://localhost:3000":           true,
			"http://127.0.0.1:3000":           true,
			"https://openvaswebv1.vercel.app": true,
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

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
