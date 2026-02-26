package entity

import "gorm.io/gorm"

type Notification struct {
	gorm.Model
	Name   string `valid:"required~Name is required"`
	UserID string `valid:"required~UserID is required"`
	Alert  bool   `valid:"required~Alert is required"`

	// ✅ GroupID ว่างได้ (nullable)
	AppGroupID *uint  `valid:"-"`
	AppGroup   *AppGroup `gorm:"foreignKey:AppGroupID" valid:"-"`

	// ✅ ยังบังคับ LineMasterID เหมือนเดิม
	AppLineMasterID uint        `valid:"required~AppLineMasterID is required"`
	AppLineMaster   *AppLineMaster `gorm:"foreignKey:AppLineMasterID" valid:"-"`
}