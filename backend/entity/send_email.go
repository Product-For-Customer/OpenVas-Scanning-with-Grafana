package entity

import "gorm.io/gorm"

type SendEmail struct {
	gorm.Model

	Email   string `json:"email" valid:"required~Email is required,email~Email is invalid"`
	PassApp string `json:"pass_app" valid:"required~PassApp is required"`

	AppUserID uint     `json:"app_user_id" valid:"required~AppUserID is required"`
	AppUser   *AppUser `gorm:"foreignKey:AppUserID" valid:"-"`
}