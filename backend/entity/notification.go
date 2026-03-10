package entity

import "gorm.io/gorm"

type AppNotification struct {
	gorm.Model
	Name   string `valid:"required~Name is required"`
	SendID string `valid:"required~SendID is required"`
	Alert  bool   `valid:"required~Alert is required"`

	// ✅ ยังบังคับ LineMasterID เหมือนเดิม
	AppLineMasterID uint        `valid:"required~AppLineMasterID is required"`
	AppLineMaster   *AppLineMaster `gorm:"foreignKey:AppLineMasterID" valid:"-"`
}