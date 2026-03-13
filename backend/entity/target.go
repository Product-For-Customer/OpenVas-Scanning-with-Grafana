package entity

import "gorm.io/gorm"

type AppTarget struct {
	gorm.Model
	Name       string        `json:"name" valid:"required~Name is required"`
	MacAddress string        `json:"mac_address" valid:"required~MacAddress is required"`

	AppLocation []AppLocation `gorm:"foreignKey:AppTargetID" json:"app_location" valid:"-"`
}