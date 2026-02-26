package entity

import "gorm.io/gorm"

type AppGroup struct {
	gorm.Model
	GroupName string `valid:"required~Group name is required"`

	Notification []Notification `gorm:"foreignKey:AppGroupID" valid:"-"`
}