package entity

import "gorm.io/gorm"

type SendEmail struct {
	gorm.Model
	Email   string `json:"email"`
	PassApp string `json:"pass_app"`
}