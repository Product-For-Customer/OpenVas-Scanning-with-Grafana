package entity

import "gorm.io/gorm"

type AppLineMaster struct {
	gorm.Model
	Name  string `valid:"required~Name is required"`
	Token string `valid:"required~Token is required"`

	Notification []AppNotification `gorm:"foreignKey:AppLineMasterID" valid:"-"`
}