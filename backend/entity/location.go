package entity

import "gorm.io/gorm"

type AppLocation struct {
	gorm.Model
	Location   string  `json:"location" valid:"required~Location is required"`
	Building   string  `json:"building" valid:"required~Building is required"`
	Floor      uint    `json:"floor" valid:"required~Floor is required"`
	Latitude   float64 `json:"latitude" valid:"required~Latitude is required"`
	Longtitude float64 `json:"longtitude" valid:"required~Longtitude is required"`

	AppTargetID uint       `json:"app_target_id" valid:"required~AppTargetID is required"`
	AppTarget   *AppTarget `gorm:"foreignKey:AppTargetID" json:"app_target,omitempty" valid:"-"`
}