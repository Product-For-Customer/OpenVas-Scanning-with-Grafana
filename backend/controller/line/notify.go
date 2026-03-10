package line

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/gin-gonic/gin"
)

type CreateAppNotificationInput struct {
	Name            string `json:"name" binding:"required"`
	SendID          string `json:"send_id" binding:"required"`
	Alert           bool   `json:"alert"`
	AppLineMasterID uint   `json:"app_line_master_id" binding:"required"`
}

type UpdateAppNotificationInput struct {
	Name            *string `json:"name"`
	SendID          *string `json:"send_id"`
	Alert           *bool   `json:"alert"`
	AppLineMasterID *uint   `json:"app_line_master_id"`
}

type AppNotificationResponse struct {
	ID              uint   `json:"id"`
	Name            string `json:"name"`
	SendID          string `json:"send_id"`
	Alert           bool   `json:"alert"`
	AppLineMasterID uint   `json:"app_line_master_id"`
}

func mapAppNotificationResponse(n entity.AppNotification) AppNotificationResponse {
	return AppNotificationResponse{
		ID:              n.ID,
		Name:            n.Name,
		SendID:          n.SendID,
		Alert:           n.Alert,
		AppLineMasterID: n.AppLineMasterID,
	}
}

func CreateAppNotification(c *gin.Context) {
	var input CreateAppNotificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var lineMaster entity.AppLineMaster
	if err := db.First(&lineMaster, input.AppLineMasterID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "app line master not found"})
		return
	}

	appNotification := entity.AppNotification{
		Name:            strings.TrimSpace(input.Name),
		SendID:          strings.TrimSpace(input.SendID),
		Alert:           input.Alert,
		AppLineMasterID: input.AppLineMasterID,
	}

	if appNotification.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}

	if appNotification.SendID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "send_id is required"})
		return
	}

	if err := db.Create(&appNotification).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("AppLineMaster").First(&appNotification, appNotification.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "create app notification success",
		"data":    mapAppNotificationResponse(appNotification),
	})
}

func ListAppNotification(c *gin.Context) {
	var notifications []entity.AppNotification

	db := config.DB()
	result := db.Preload("AppLineMaster").Find(&notifications)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	response := make([]AppNotificationResponse, 0, len(notifications))
	for _, n := range notifications {
		response = append(response, mapAppNotificationResponse(n))
	}

	c.JSON(http.StatusOK, response)
}

func UpdateAppNotificationByID(c *gin.Context) {
	id := c.Param("id")

	nid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid app notification id"})
		return
	}

	var input UpdateAppNotificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var appNotification entity.AppNotification
	if err := db.Preload("AppLineMaster").First(&appNotification, uint(nid)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "app notification not found"})
		return
	}

	if input.Name != nil {
		trimmedName := strings.TrimSpace(*input.Name)
		if trimmedName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "name cannot be empty"})
			return
		}
		appNotification.Name = trimmedName
	}

	if input.SendID != nil {
		trimmedSendID := strings.TrimSpace(*input.SendID)
		if trimmedSendID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "send_id cannot be empty"})
			return
		}
		appNotification.SendID = trimmedSendID
	}

	if input.Alert != nil {
		appNotification.Alert = *input.Alert
	}

	if input.AppLineMasterID != nil {
		var lineMaster entity.AppLineMaster
		if err := db.First(&lineMaster, *input.AppLineMasterID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "app line master not found"})
			return
		}
		appNotification.AppLineMasterID = *input.AppLineMasterID
	}

	if err := db.Save(&appNotification).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("AppLineMaster").First(&appNotification, appNotification.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "update app notification success",
		"data":    mapAppNotificationResponse(appNotification),
	})
}

func DeleteAppNotificationByID(c *gin.Context) {
	id := c.Param("id")

	nid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid app notification id"})
		return
	}

	db := config.DB()

	var appNotification entity.AppNotification
	if err := db.First(&appNotification, uint(nid)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "app notification not found"})
		return
	}

	if err := db.Delete(&appNotification).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "app notification deleted successfully"})
}