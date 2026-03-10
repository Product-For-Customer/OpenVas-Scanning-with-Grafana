package line

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateAppLineMasterInput struct {
	Name  string `json:"name" binding:"required"`
	Token string `json:"token" binding:"required"`
}

type UpdateAppLineMasterInput struct {
	Name  *string `json:"name"`
	Token *string `json:"token"`
}

type AppLineMasterResponse struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Token string `json:"token"`
}

func mapAppLineMasterResponse(lineMaster entity.AppLineMaster) AppLineMasterResponse {
	return AppLineMasterResponse{
		ID:    lineMaster.ID,
		Name:  lineMaster.Name,
		Token: lineMaster.Token,
	}
}

func CreateAppLineMaster(c *gin.Context) {
	var input CreateAppLineMasterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	name := strings.TrimSpace(input.Name)
	token := strings.TrimSpace(input.Token)

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token is required"})
		return
	}

	var existingName entity.AppLineMaster
	err := db.Where("LOWER(name) = LOWER(?)", name).First(&existingName).Error
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "app line master name already exists"})
		return
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check existing app line master name"})
		return
	}

	var existingToken entity.AppLineMaster
	err = db.Where("token = ?", token).First(&existingToken).Error
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "app line master token already exists"})
		return
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check existing app line master token"})
		return
	}

	lineMaster := entity.AppLineMaster{
		Name:  name,
		Token: token,
	}

	if err := db.Create(&lineMaster).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "create app line master success",
		"data":    mapAppLineMasterResponse(lineMaster),
	})
}

func ListAppLineMaster(c *gin.Context) {
	var lineMasters []entity.AppLineMaster

	db := config.DB()
	result := db.Order("id asc").Find(&lineMasters)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	response := make([]AppLineMasterResponse, 0, len(lineMasters))
	for _, item := range lineMasters {
		response = append(response, mapAppLineMasterResponse(item))
	}

	c.JSON(http.StatusOK, response)
}

func UpdateAppLineMasterByID(c *gin.Context) {
	id := c.Param("id")

	lineMasterID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid app line master id"})
		return
	}

	var input UpdateAppLineMasterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var lineMaster entity.AppLineMaster
	if err := db.First(&lineMaster, uint(lineMasterID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "app line master not found"})
		return
	}

	updates := map[string]interface{}{}

	if input.Name != nil {
		name := strings.TrimSpace(*input.Name)
		if name == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "name cannot be empty"})
			return
		}

		var existing entity.AppLineMaster
		err := db.Where("LOWER(name) = LOWER(?) AND id <> ?", name, lineMaster.ID).First(&existing).Error
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "app line master name already exists"})
			return
		}
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check existing app line master name"})
			return
		}

		updates["name"] = name
	}

	if input.Token != nil {
		token := strings.TrimSpace(*input.Token)
		if token == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "token cannot be empty"})
			return
		}

		var existing entity.AppLineMaster
		err := db.Where("token = ? AND id <> ?", token, lineMaster.ID).First(&existing).Error
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "app line master token already exists"})
			return
		}
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check existing app line master token"})
			return
		}

		updates["token"] = token
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
		return
	}

	tx := db.Model(&entity.AppLineMaster{}).
		Where("id = ?", lineMaster.ID).
		Updates(updates)

	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		return
	}

	var updated entity.AppLineMaster
	if err := db.First(&updated, lineMaster.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reload updated app line master"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "update app line master success",
		"data":    mapAppLineMasterResponse(updated),
	})
}

func DeleteAppLineMasterByID(c *gin.Context) {
	id := c.Param("id")

	lineMasterID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid app line master id"})
		return
	}

	db := config.DB()

	var lineMaster entity.AppLineMaster
	if err := db.First(&lineMaster, uint(lineMasterID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "app line master not found"})
		return
	}

	if err := db.Delete(&lineMaster).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "app line master deleted successfully",
	})
}