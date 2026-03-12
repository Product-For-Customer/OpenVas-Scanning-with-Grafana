package entity

import "gorm.io/gorm"

type AppLocation struct {
	gorm.Model
	Name       string  `valid:"required~Name name is required"`
	Building   string  `valid:"required~Building is required"`
	Floor      uint    `valid:"required~Floor is required"`
	Location   string  `valid:"required~Location is required"`
	Latitude   float64 `valid:"required~Latitude is required"`
	Longtitude float64 `valid:"required~Longtitude is required"`
}