package entity

import "gorm.io/gorm"

type AppLineMaster struct {
	gorm.Model
	Token string `valid:"required~Token is required"`

	Notification []Notification `gorm:"foreignKey:AppLineMasterID" valid:"-"`
}