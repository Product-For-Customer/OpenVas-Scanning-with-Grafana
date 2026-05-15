package entity

import "gorm.io/gorm"

type AppLineMaster struct {
	gorm.Model

	Name        string `json:"name" valid:"required~Name is required"`
	Description string `json:"description" gorm:"type:text" valid:"required~Description is required"`
	Token       string `json:"token" valid:"required~Token is required"`

	AppUserID uint     `json:"app_user_id" gorm:"not null;index" valid:"required~AppUserID is required"`
	AppUser   *AppUser `json:"app_user" gorm:"foreignKey:AppUserID" valid:"-"`

	Notification []AppNotification `json:"notification" gorm:"foreignKey:AppLineMasterID" valid:"-"`
}