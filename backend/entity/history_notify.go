package entity

import (
	"time"

	"gorm.io/gorm"
)

type AppHistoryNotify struct {
	gorm.Model
	Subject     string    `valid:"required~Subject is required"`
	DateTime    time.Time `valid:"required~DateTime is required"`
	Description string    `valid:"required~Description is required"`

	AppStatusNotifyID *uint            `valid:"-"`
	AppStatusNotify   *AppStatusNotify `gorm:"foreignKey:AppStatusNotifyID" valid:"-"`
}