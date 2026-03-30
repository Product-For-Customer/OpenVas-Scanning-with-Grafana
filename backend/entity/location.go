package entity

import "gorm.io/gorm"

type AppLocation struct {
	gorm.Model
	Location   string  `json:"location" valid:"required~Location is required"`
	Building   string  `json:"building" valid:"required~Building is required"`
	Floor      uint    `json:"floor" valid:"required~Floor is required"`
	Latitude   float64 `json:"latitude" valid:"required~Latitude is required"`
	Longtitude float64 `json:"longtitude" valid:"required~Longtitude is required"`

	// เปลี่ยนจาก AppTargetID/AppTarget entity
	// มาเก็บ TargetID ตรง ๆ แบบเดียวกับ Own.TargetID
	TargetID string `json:"target_id" gorm:"type:varchar(255);not null;index"`
}