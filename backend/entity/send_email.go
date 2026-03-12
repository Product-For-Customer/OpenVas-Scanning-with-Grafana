package entity

import "gorm.io/gorm"

type SendEmail struct {
	gorm.Model
	Email   string `json:"email" valid:"required~Email is required,email~Email is invalid"`
	PassApp string `json:"pass_app" valid:"required~PassApp is required"`
}