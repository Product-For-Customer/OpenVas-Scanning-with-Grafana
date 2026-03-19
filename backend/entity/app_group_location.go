package entity

type AppGroupLocation struct {
	AppGroupID    uint `gorm:"primaryKey"`
	AppLocationID uint `gorm:"primaryKey"`
}