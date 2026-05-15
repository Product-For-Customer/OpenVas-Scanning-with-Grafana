package entity

import "gorm.io/gorm"

type AppDiagram struct {
	gorm.Model

	Name        string `json:"name" gorm:"type:varchar(255);not null" valid:"required~Name is required"`
	Description string `json:"description" gorm:"type:text"`
	ImageBase64 string `json:"image_base64" gorm:"type:text;not null" valid:"required~ImageBase64 is required"`

	AppUserID uint     `json:"app_user_id" valid:"required~AppUserID is required"`
	AppUser   *AppUser `json:"app_user" gorm:"foreignKey:AppUserID" valid:"-"`

	AppDiagramNodes []AppDiagramNode `json:"app_diagram_nodes" gorm:"foreignKey:DiagramID"`
}