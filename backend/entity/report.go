package entity

import "gorm.io/gorm"

type AppReport struct {
	gorm.Model
	CompanyName string `json:"company_name" valid:"required~CompanyName is required"`
	Logo        string `gorm:"type:text" json:"logo" valid:"required~Logo is required"`
}