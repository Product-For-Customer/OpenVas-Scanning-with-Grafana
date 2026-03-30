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
	Location   string  `json:"location" binding:"required"`
	Building   string  `json:"building" binding:"required"`
	Floor      uint    `json:"floor" binding:"required"`
	Latitude   float64 `json:"latitude" binding:"required"`
	Longtitude float64 `json:"longtitude" binding:"required"`
	TargetID   string  `json:"target_id" binding:"required"`
}

type UpdateLocationInput struct {
	Location   *string  `json:"location"`
	Building   *string  `json:"building"`
	Floor      *uint    `json:"floor"`
	Latitude   *float64 `json:"latitude"`
	Longtitude *float64 `json:"longtitude"`
	TargetID   *string  `json:"target_id"`
}

type TargetInfo struct {
	TaskID   string `json:"task_id"`
	Hostname string `json:"hostname"`
	IP       string `json:"ip"`
}

type LocationResponse struct {
	ID         uint        `json:"id"`
	Location   string      `json:"location"`
	Building   string      `json:"building"`
	Floor      uint        `json:"floor"`
	Latitude   float64     `json:"latitude"`
	Longtitude float64     `json:"longtitude"`
	TargetID   string      `json:"target_id"`
	Target     *TargetInfo `json:"target,omitempty"`
	CreatedAt  interface{} `json:"created_at"`
	UpdatedAt  interface{} `json:"updated_at"`
}

type locationListRow struct {
	ID         uint    `json:"id"`
	Location   string  `json:"location"`
	Building   string  `json:"building"`
	Floor      uint    `json:"floor"`
	Latitude   float64 `json:"latitude"`
	Longtitude float64 `json:"longtitude"`
	TargetID   string  `json:"target_id"`
	Hostname   string  `json:"hostname"`
	IP         string  `json:"ip"`
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

func mapLocationResponse(loc entity.AppLocation) LocationResponse {
	return LocationResponse{
		ID:         loc.ID,
		Location:   loc.Location,
		Building:   loc.Building,
		Floor:      loc.Floor,
		Latitude:   loc.Latitude,
		Longtitude: loc.Longtitude,
		TargetID:   loc.TargetID,
		Target: nil,
		CreatedAt:  loc.CreatedAt,
		UpdatedAt:  loc.UpdatedAt,
	}
}

func mapLocationRowResponse(row locationListRow, createdAt interface{}, updatedAt interface{}) LocationResponse {
	resp := LocationResponse{
		ID:         row.ID,
		Location:   row.Location,
		Building:   row.Building,
		Floor:      row.Floor,
		Latitude:   row.Latitude,
		Longtitude: row.Longtitude,
		TargetID:   row.TargetID,
		CreatedAt:  createdAt,
		UpdatedAt:  updatedAt,
	}

	trimHostname := strings.TrimSpace(row.Hostname)
	trimIP := strings.TrimSpace(row.IP)
	trimTaskID := strings.TrimSpace(row.TargetID)

	if trimTaskID != "" || trimHostname != "" || trimIP != "" {
		resp.Target = &TargetInfo{
			TaskID:   trimTaskID,
			Hostname: trimHostname,
			IP:       trimIP,
		}
	}

	return resp
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
	targetID := cleanString(input.TargetID)

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

	if targetID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "target_id cannot be empty",
		})
		return
	}

	location := entity.AppLocation{
		Location:   locationName,
		Building:   buildingName,
		Floor:      input.Floor,
		Latitude:   input.Latitude,
		Longtitude: input.Longtitude,
		TargetID:   targetID,
	}

	if err := db.Create(&location).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := db.First(&location, location.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to reload created location",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "create location success",
		"data":    mapLocationResponse(location),
	})
}

func ListLocation(c *gin.Context) {
	db := config.DB()

	query := `
WITH
LatestReportPerTask AS (
  SELECT DISTINCT ON (rp.task)
    rp.task AS task_id,
    rp.id AS report_id,
    rp.creation_time
  FROM public.reports rp
  WHERE rp.task IS NOT NULL
  ORDER BY rp.task, rp.creation_time DESC, rp.id DESC
),
LatestTaskHosts AS (
  SELECT DISTINCT
    lrt.task_id::text AS task_id,
    COALESCE(NULLIF(BTRIM(t.name), ''), '-') AS hostname,
    COALESCE(NULLIF(BTRIM(r.host), ''), '') AS ip,
    lrt.creation_time
  FROM LatestReportPerTask lrt
  JOIN public.results r
    ON r.report = lrt.report_id
  LEFT JOIN public.tasks t
    ON t.id = lrt.task_id
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
)
SELECT
  al.id,
  al.location,
  al.building,
  al.floor,
  al.latitude,
  al.longtitude,
  al.target_id,
  al.created_at,
  al.updated_at,
  COALESCE(lth.hostname, '') AS hostname,
  COALESCE(lth.ip, '') AS ip
FROM app_locations al
LEFT JOIN LatestTaskHosts lth
  ON BTRIM(lth.task_id) = BTRIM(al.target_id)
WHERE al.deleted_at IS NULL
ORDER BY al.id ASC;
`

	type locationListResult struct {
		ID         uint    `json:"id"`
		Location   string  `json:"location"`
		Building   string  `json:"building"`
		Floor      uint    `json:"floor"`
		Latitude   float64 `json:"latitude"`
		Longtitude float64 `json:"longtitude"`
		TargetID   string  `json:"target_id"`
		CreatedAt  string  `json:"created_at"`
		UpdatedAt  string  `json:"updated_at"`
		Hostname   string  `json:"hostname"`
		IP         string  `json:"ip"`
	}

	rows := make([]locationListResult, 0)
	if err := db.Raw(query).Scan(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to list locations",
			"detail": err.Error(),
		})
		return
	}

	response := make([]gin.H, 0, len(rows))
	for _, row := range rows {
		response = append(response, gin.H{
			"id":          row.ID,
			"location":    row.Location,
			"building":    row.Building,
			"floor":       row.Floor,
			"latitude":    row.Latitude,
			"longtitude":  row.Longtitude,
			"target_id":   row.TargetID,
			"created_at":  row.CreatedAt,
			"updated_at":  row.UpdatedAt,
			"target_info": gin.H{
				"task_id":  row.TargetID,
				"hostname": row.Hostname,
				"ip":       row.IP,
			},
		})
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

	query := `
WITH
LatestReportPerTask AS (
  SELECT DISTINCT ON (rp.task)
    rp.task AS task_id,
    rp.id AS report_id,
    rp.creation_time
  FROM public.reports rp
  WHERE rp.task IS NOT NULL
  ORDER BY rp.task, rp.creation_time DESC, rp.id DESC
),
LatestTaskHosts AS (
  SELECT DISTINCT
    lrt.task_id::text AS task_id,
    COALESCE(NULLIF(BTRIM(t.name), ''), '-') AS hostname,
    COALESCE(NULLIF(BTRIM(r.host), ''), '') AS ip,
    lrt.creation_time
  FROM LatestReportPerTask lrt
  JOIN public.results r
    ON r.report = lrt.report_id
  LEFT JOIN public.tasks t
    ON t.id = lrt.task_id
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
)
SELECT
  al.id,
  al.location,
  al.building,
  al.floor,
  al.latitude,
  al.longtitude,
  al.target_id,
  al.created_at,
  al.updated_at,
  COALESCE(lth.hostname, '') AS hostname,
  COALESCE(lth.ip, '') AS ip
FROM app_locations al
LEFT JOIN LatestTaskHosts lth
  ON BTRIM(lth.task_id) = BTRIM(al.target_id)
WHERE al.deleted_at IS NULL
  AND al.id = ?
LIMIT 1;
`

	type locationByIDResult struct {
		ID         uint    `json:"id"`
		Location   string  `json:"location"`
		Building   string  `json:"building"`
		Floor      uint    `json:"floor"`
		Latitude   float64 `json:"latitude"`
		Longtitude float64 `json:"longtitude"`
		TargetID   string  `json:"target_id"`
		CreatedAt  string  `json:"created_at"`
		UpdatedAt  string  `json:"updated_at"`
		Hostname   string  `json:"hostname"`
		IP         string  `json:"ip"`
	}

	var row locationByIDResult
	if err := db.Raw(query, uint(lid)).Scan(&row).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to get location by id",
			"detail": err.Error(),
		})
		return
	}

	if row.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "location not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":         row.ID,
			"location":   row.Location,
			"building":   row.Building,
			"floor":      row.Floor,
			"latitude":   row.Latitude,
			"longtitude": row.Longtitude,
			"target_id":  row.TargetID,
			"created_at": row.CreatedAt,
			"updated_at": row.UpdatedAt,
			"target_info": gin.H{
				"task_id":  row.TargetID,
				"hostname": row.Hostname,
				"ip":       row.IP,
			},
		},
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
		c.JSON(http.StatusNotFound, gin.H{
			"error": "location not found",
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

	if input.TargetID != nil {
		newTargetID := cleanOptionalString(input.TargetID)
		if newTargetID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "target_id cannot be empty",
			})
			return
		}
		updates["target_id"] = newTargetID
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "no fields to update",
		})
		return
	}

	tx := db.Model(&entity.AppLocation{}).
		Where("id = ?", location.ID).
		Updates(updates)

	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": tx.Error.Error(),
		})
		return
	}

	var updatedLocation entity.AppLocation
	if err := db.First(&updatedLocation, location.ID).Error; err != nil {
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