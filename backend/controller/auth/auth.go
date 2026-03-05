package auth

import (
	"net/http"
	"strings"
	"time"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/dto"
	"github.com/Tawunchai/openvas/entity"
	"github.com/Tawunchai/openvas/utils"
	"github.com/gin-gonic/gin"
)

func isHTTPSRequest(c *gin.Context) bool {
	// รองรับ reverse proxy / vercel / ngrok
	if c.Request.TLS != nil {
		return true
	}

	if strings.EqualFold(c.GetHeader("X-Forwarded-Proto"), "https") {
		return true
	}

	origin := c.GetHeader("Origin")
	return strings.HasPrefix(origin, "https://")
}

func setAuthCookie(c *gin.Context, token string) {
	secure := isHTTPSRequest(c)

	sameSiteMode := http.SameSiteLaxMode
	if secure {
		// ถ้า frontend กับ backend คนละ site และวิ่งผ่าน https
		// ต้องใช้ None เพื่อให้ browser ส่ง cookie ข้าม site ได้
		sameSiteMode = http.SameSiteNoneMode
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSiteMode,
		MaxAge:   60 * 60 * 24, // 1 day
	})
}

func clearAuthCookie(c *gin.Context) {
	secure := isHTTPSRequest(c)

	sameSiteMode := http.SameSiteLaxMode
	if secure {
		sameSiteMode = http.SameSiteNoneMode
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSiteMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
}

func Login(c *gin.Context) {
	var input dto.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := config.DB()

	var user entity.AppUser
	err := db.Preload("AppRole").
		Where("LOWER(email) = LOWER(?)", input.Email).
		First(&user).Error
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	roleName := ""
	if user.AppRole != nil {
		roleName = user.AppRole.Role
	}

	token, err := config.GenerateJWT(user.ID, user.Email, roleName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to generate token",
		})
		return
	}

	setAuthCookie(c, token)

	c.JSON(http.StatusOK, gin.H{
		"message": "login success",
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"role":       roleName,
		},
	})
}

func Me(c *gin.Context) {
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user id in context"})
		return
	}

	db := config.DB()

	var user entity.AppUser
	err := db.Preload("AppRole").First(&user, userID).Error
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	roleName := ""
	if user.AppRole != nil {
		roleName = user.AppRole.Role
	}

	response := dto.MeResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Profile:   user.Profile,
		Phone:     user.PhoneNumber,
		Location:  user.Location,
		Position:  user.Position,
		Role:      roleName,
	}

	c.JSON(http.StatusOK, response)
}

func Logout(c *gin.Context) {
	clearAuthCookie(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "logout success",
	})
}