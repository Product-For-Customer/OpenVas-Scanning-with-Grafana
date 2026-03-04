package entity

import (
	
	"gorm.io/gorm"
)

type AppStatusNotify struct {
	gorm.Model
	Status string
	
	Notification []Notification `gorm:"foreignKey:AppStatusNotifyID" valid:"-"`
}