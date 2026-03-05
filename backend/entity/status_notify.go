package entity

import (
	
	"gorm.io/gorm"
)

type AppStatusNotify struct {
	gorm.Model
	Status string
	
	AppHistoryNotify []AppHistoryNotify `gorm:"foreignKey:AppStatusNotifyID" valid:"-"`
}