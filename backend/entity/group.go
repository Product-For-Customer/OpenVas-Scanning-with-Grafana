package entity

import "gorm.io/gorm"

type AppGroup struct {
	gorm.Model
	GroupName string `json:"group_name" valid:"required~GroupName is required"`

	AppLocations []AppLocation `gorm:"many2many:app_group_locations;" json:"app_locations,omitempty"`
}