package entity

import "gorm.io/gorm"

type OTP struct {
	gorm.Model
	Email     string `json:"email"`
	Code      string `json:"code"`
	ExpiresAt int64  `json:"expires_at"`
	Verified  bool   `json:"verified"`
}