package entity

import "gorm.io/gorm"

type AppStatusNotify struct {
	gorm.Model
	Status string `valid:"required~Status is required"`

	AppHistoryNotify []AppHistoryNotify `gorm:"foreignKey:AppStatusNotifyID" valid:"-"`
}