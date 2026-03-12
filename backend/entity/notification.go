package entity

import "gorm.io/gorm"

type AppNotification struct {
	gorm.Model
	Name    string `json:"name" valid:"required~Name is required"`
	SendID  string `json:"send_id" valid:"required~SendID is required"`
	Alert   bool   `json:"alert" valid:"required~Alert is required"`
	IsGroup bool   `json:"is_group" valid:"required~IsGroup is required"`

	AppLineMasterID uint           `json:"app_line_master_id" valid:"required~AppLineMasterID is required"`
	AppLineMaster   *AppLineMaster `gorm:"foreignKey:AppLineMasterID" valid:"-"`
}