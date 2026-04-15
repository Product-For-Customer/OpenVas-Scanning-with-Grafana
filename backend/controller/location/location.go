package location

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateLocationInput struct {
	Location         string  `json:"location" binding:"required"`
	Building         string  `json:"building" binding:"required"`
	Floor            uint    `json:"floor" binding:"required"`
	Latitude         float64 `json:"latitude" binding:"required"`
	Longtitude       float64 `json:"longtitude" binding:"required"`
	AppDiagramNodeID uint    `json:"app_diagram_node_id" binding:"required"`
}

type UpdateLocationInput struct {
	Location         *string  `json:"location"`
	Building         *string  `json:"building"`
	Floor            *uint    `json:"floor"`
	Latitude         *float64 `json:"latitude"`
	Longtitude       *float64 `json:"longtitude"`
	AppDiagramNodeID *uint    `json:"app_diagram_node_id"`
}

type AppDiagramNodeInfo struct {
	ID          uint    `json:"id"`
	DiagramID   uint    `json:"diagram_id"`
	TaskID      string  `json:"task_id"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
	Icon        string  `json:"icon"`
	X           float64 `json:"x"`
	Y           float64 `json:"y"`
	Width       float64 `json:"width"`
	Height      float64 `json:"height"`
	ZIndex      int     `json:"z_index"`
}

type LocationResponse struct {
	ID               uint                 `json:"id"`
	Location         string               `json:"location"`
	Building         string               `json:"building"`
	Floor            uint                 `json:"floor"`
	Latitude         float64              `json:"latitude"`
	Longtitude       float64              `json:"longtitude"`
	AppDiagramNodeID uint                 `json:"app_diagram_node_id"`
	AppDiagramNode   *AppDiagramNodeInfo  `json:"app_diagram_node,omitempty"`
	CreatedAt        interface{}          `json:"created_at"`
	UpdatedAt        interface{}          `json:"updated_at"`
}

func cleanString(value string) string {
	return strings.TrimSpace(value)
}

func cleanOptionalString(value *string) string {
	if value == nil {
		return ""
	}
	return strings.TrimSpace(*value)
}

func mapAppDiagramNodeInfo(node *entity.AppDiagramNode) *AppDiagramNodeInfo {
	if node == nil || node.ID == 0 {
		return nil
	}

	return &AppDiagramNodeInfo{
		ID:          node.ID,
		DiagramID:   node.DiagramID,
		TaskID:      node.TaskID,
		Label:       node.Label,
		Description: node.Description,
		Icon:        node.Icon,
		X:           node.X,
		Y:           node.Y,
		Width:       node.Width,
		Height:      node.Height,
		ZIndex:      node.ZIndex,
	}
}

func mapLocationResponse(loc entity.AppLocation) LocationResponse {
	return LocationResponse{
		ID:               loc.ID,
		Location:         loc.Location,
		Building:         loc.Building,
		Floor:            loc.Floor,
		Latitude:         loc.Latitude,
		Longtitude:       loc.Longtitude,
		AppDiagramNodeID: loc.AppDiagramNodeID,
		AppDiagramNode:   mapAppDiagramNodeInfo(loc.AppDiagramNode),
		CreatedAt:        loc.CreatedAt,
		UpdatedAt:        loc.UpdatedAt,
	}
}

func CreateLocation(c *gin.Context) {
	var input CreateLocationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := config.DB()

	locationName := cleanString(input.Location)
	buildingName := cleanString(input.Building)

	if locationName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "location cannot be empty",
		})
		return
	}

	if buildingName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "building cannot be empty",
		})
		return
	}

	var node entity.AppDiagramNode
	if err := db.First(&node, input.AppDiagramNodeID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "app_diagram_node_id not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	location := entity.AppLocation{
		Location:         locationName,
		Building:         buildingName,
		Floor:            input.Floor,
		Latitude:         input.Latitude,
		Longtitude:       input.Longtitude,
		AppDiagramNodeID: input.AppDiagramNodeID,
	}

	if err := db.Create(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var createdLocation entity.AppLocation
	if err := db.Preload("AppDiagramNode").First(&createdLocation, location.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to reload created location",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "create location success",
		"data":    mapLocationResponse(createdLocation),
	})
}

func ListLocation(c *gin.Context) {
	db := config.DB()

	var locations []entity.AppLocation
	if err := db.
		Preload("AppDiagramNode").
		Order("id ASC").
		Find(&locations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to list locations",
		})
		return
	}

	response := make([]LocationResponse, 0, len(locations))
	for _, loc := range locations {
		response = append(response, mapLocationResponse(loc))
	}

	c.JSON(http.StatusOK, gin.H{
		"data": response,
	})
}

func ListLocationByID(c *gin.Context) {
	id := c.Param("id")

	lid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid location id",
		})
		return
	}

	db := config.DB()

	var location entity.AppLocation
	if err := db.
		Preload("AppDiagramNode").
		First(&location, uint(lid)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "location not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to get location by id",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": mapLocationResponse(location),
	})
}

func UpdateLocationByID(c *gin.Context) {
	id := c.Param("id")

	lid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid location id",
		})
		return
	}

	var input UpdateLocationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := config.DB()

	var location entity.AppLocation
	if err := db.First(&location, uint(lid)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "location not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	updates := map[string]interface{}{}

	if input.Location != nil {
		newLocation := cleanOptionalString(input.Location)
		if newLocation == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "location cannot be empty",
			})
			return
		}
		updates["location"] = newLocation
	}

	if input.Building != nil {
		newBuilding := cleanOptionalString(input.Building)
		if newBuilding == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "building cannot be empty",
			})
			return
		}
		updates["building"] = newBuilding
	}

	if input.Floor != nil {
		updates["floor"] = *input.Floor
	}

	if input.Latitude != nil {
		updates["latitude"] = *input.Latitude
	}

	if input.Longtitude != nil {
		updates["longtitude"] = *input.Longtitude
	}

	if input.AppDiagramNodeID != nil {
		var node entity.AppDiagramNode
		if err := db.First(&node, *input.AppDiagramNodeID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "app_diagram_node_id not found",
				})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		updates["app_diagram_node_id"] = *input.AppDiagramNodeID
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "no fields to update",
		})
		return
	}

	if err := db.Model(&entity.AppLocation{}).
		Where("id = ?", location.ID).
		Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var updatedLocation entity.AppLocation
	if err := db.Preload("AppDiagramNode").First(&updatedLocation, location.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to reload updated location",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "update location success",
		"data":    mapLocationResponse(updatedLocation),
	})
}

func DeleteLocationByID(c *gin.Context) {
	id := c.Param("id")

	lid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid location id",
		})
		return
	}

	db := config.DB()

	var location entity.AppLocation
	if err := db.First(&location, uint(lid)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "location not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := db.Delete(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "location deleted successfully",
	})
}