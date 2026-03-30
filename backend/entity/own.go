package entity

import "gorm.io/gorm"

type Own struct {
	gorm.Model

	AppUserID uint     `gorm:"not null;index;uniqueIndex:idx_user_target"`
	AppUser   *AppUser `gorm:"foreignKey:AppUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	TargetID string `gorm:"type:varchar(255);not null;index;uniqueIndex:idx_user_target"`
}

type OwnTargetItem struct {
	OwnID    uint   `json:"own_id" gorm:"column:own_id"`
	TaskID   string `json:"task_id" gorm:"column:task_id"`
	Hostname string `json:"hostname" gorm:"column:hostname"`
	IP       string `json:"ip" gorm:"column:ip"`
}

type ListOwnByUserIDResponse struct {
	UserID  uint            `json:"user_id"`
	Targets []OwnTargetItem `json:"targets"`
}