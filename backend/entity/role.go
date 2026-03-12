package entity

import "gorm.io/gorm"

type AppRole struct {
	gorm.Model
	Role string `valid:"required~Role is required"`

	AppUser []AppUser `gorm:"foreignKey:AppRoleID" valid:"-"`
}