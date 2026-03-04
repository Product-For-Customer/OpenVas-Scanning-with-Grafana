package entity

import (
	
	"gorm.io/gorm"
)

type AppRole struct {
	gorm.Model
	Role string
	
	AppUser []AppUser `gorm:"foreignKey:AppRoleID"`
}