package own

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/gin-gonic/gin"
)

type OwnTargetItem struct {
	TaskID   string `json:"task_id"`
	Hostname string `json:"hostname"`
	IP       string `json:"ip"`
}

type ListOwnByUserIDResponse struct {
	UserID  uint            `json:"user_id"`
	Targets []OwnTargetItem `json:"targets"`
}

func ListOwnByUserID(c *gin.Context) {
	userIDParam := c.Param("id")
	userID64, err := strconv.ParseUint(userIDParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})
		return
	}
	userID := uint(userID64)

	db := config.DB()

	// ตรวจสอบก่อนว่ามี user นี้จริงไหม
	var user entity.AppUser
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	query := `
WITH
-- =========================================================
-- 1) หา latest report ของทุก task
-- =========================================================
LatestReportPerTask AS (
  SELECT DISTINCT ON (rp.task)
    rp.task AS task_id,
    rp.id AS report_id,
    rp.creation_time
  FROM public.reports rp
  WHERE rp.task IS NOT NULL
  ORDER BY rp.task, rp.creation_time DESC, rp.id DESC
),

-- =========================================================
-- 2) ดึง host จาก latest report ของแต่ละ task
-- =========================================================
LatestTaskHosts AS (
  SELECT DISTINCT
    lrt.task_id::text AS task_id,
    COALESCE(NULLIF(BTRIM(t.name), ''), '-') AS task_name,
    COALESCE(NULLIF(BTRIM(r.host), ''), '') AS host_ip,
    lrt.creation_time
  FROM LatestReportPerTask lrt
  JOIN public.results r
    ON r.report = lrt.report_id
  LEFT JOIN public.tasks t
    ON t.id = lrt.task_id
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
),

-- =========================================================
-- 3) join own กับ latest task hosts
--    สำคัญ: ต้องกรอง soft delete ด้วย
-- =========================================================
OwnWithTask AS (
  SELECT
    o.id AS own_id,
    lth.task_id,
    lth.task_name AS hostname,
    lth.host_ip AS ip,
    lth.creation_time
  FROM owns o
  JOIN LatestTaskHosts lth
    ON lth.task_id = o.target_id
  WHERE o.app_user_id = ?
    AND o.deleted_at IS NULL
)

SELECT
  own_id,
  task_id,
  hostname,
  ip
FROM OwnWithTask
ORDER BY creation_time DESC, ip ASC, hostname ASC;
`

	targets := make([]entity.OwnTargetItem, 0)
	if err := db.Raw(query, userID).Scan(&targets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to list own targets by user id",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, entity.ListOwnByUserIDResponse{
		UserID:  userID,
		Targets: targets,
	})
}

type CreateOwnRequest struct {
	AppUserID uint   `json:"app_user_id" binding:"required"`
	TargetID  string `json:"target_id" binding:"required"`
}

type OwnResponse struct {
	ID        uint   `json:"id"`
	AppUserID uint   `json:"app_user_id"`
	TargetID  string `json:"target_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func mapOwnResponse(o entity.Own) OwnResponse {
	return OwnResponse{
		ID:        o.ID,
		AppUserID: o.AppUserID,
		TargetID:  o.TargetID,
		CreatedAt: o.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: o.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}

func CreateOwn(c *gin.Context) {
	var req CreateOwnRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	req.TargetID = strings.TrimSpace(req.TargetID)

	if req.AppUserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "app_user_id is required",
		})
		return
	}

	if req.TargetID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "target_id is required",
		})
		return
	}

	db := config.DB()

	// เช็กว่ามี user จริงไหม
	var user entity.AppUser
	if err := db.First(&user, req.AppUserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	// กันข้อมูลซ้ำ app_user_id + target_id
	var existing entity.Own
	if err := db.Where("app_user_id = ? AND target_id = ?", req.AppUserID, req.TargetID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "this user already owns this target",
		})
		return
	}

	own := entity.Own{
		AppUserID: req.AppUserID,
		TargetID:  req.TargetID,
	}

	if err := db.Create(&own).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := db.Preload("AppUser").First(&own, own.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "created own but failed to reload data",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "create own success",
		"data":    mapOwnResponse(own),
	})
}

func DeleteOwnByID(c *gin.Context) {
	idParam := c.Param("id")

	ownID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid own id",
		})
		return
	}

	db := config.DB()

	var own entity.Own
	if err := db.First(&own, uint(ownID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "own not found",
		})
		return
	}

	if err := db.Delete(&own).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete own",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "delete own success",
		"data": gin.H{
			"id":         own.ID,
			"app_user_id": own.AppUserID,
			"target_id":  own.TargetID,
		},
	})
}

type TaskIDForOwnItem struct {
	TaskID   string `json:"task_id"`
	Hostname string `json:"hostname"`
	IP       string `json:"ip"`
}

func ListTaskIDForOwn(c *gin.Context) {
	db := config.DB()

	query := `
WITH
-- =========================================================
-- 1) หา latest report ของทุก task
-- =========================================================
LatestReportPerTask AS (
  SELECT DISTINCT ON (rp.task)
    rp.task AS task_id,
    rp.id AS report_id,
    rp.creation_time
  FROM public.reports rp
  WHERE rp.task IS NOT NULL
  ORDER BY rp.task, rp.creation_time DESC, rp.id DESC
),

-- =========================================================
-- 2) ดึง host จาก latest report ของแต่ละ task
-- =========================================================
LatestTaskHosts AS (
  SELECT DISTINCT
    lrt.task_id::text AS task_id,
    COALESCE(NULLIF(BTRIM(t.name), ''), '-') AS task_name,
    COALESCE(NULLIF(BTRIM(r.host), ''), '') AS host_ip,
    lrt.creation_time
  FROM LatestReportPerTask lrt
  JOIN public.results r
    ON r.report = lrt.report_id
  LEFT JOIN public.tasks t
    ON t.id = lrt.task_id
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
)

-- =========================================================
-- 3) เอามาแค่ TaskID, Hostname, IP
-- =========================================================
SELECT
  lth.task_id AS task_id,
  lth.task_name AS hostname,
  lth.host_ip AS ip
FROM LatestTaskHosts lth
ORDER BY
  lth.creation_time DESC,
  lth.task_name ASC,
  lth.host_ip ASC;
`

	results := make([]TaskIDForOwnItem, 0)
	if err := db.Raw(query).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to list task id for own",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": results,
	})
}

type TaskByTaskIDItem struct {
	Hostname string `json:"hostname"`
	IP       string `json:"ip"`
}

func ListTaskByTaskID(c *gin.Context) {
	db := config.DB()

	taskID := strings.TrimSpace(c.Param("task_id"))
	if taskID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "task_id is required",
		})
		return
	}

	query := `
WITH
-- =========================================================
-- 1) หา latest report ของ task ที่เลือก
-- =========================================================
InputTaskLatestReport AS (
  SELECT DISTINCT ON (rp.task)
    rp.task AS task_id,
    rp.id AS report_id,
    rp.creation_time
  FROM public.reports rp
  WHERE BTRIM(rp.task::text) = BTRIM(?)
  ORDER BY rp.task, rp.creation_time DESC, rp.id DESC
),

-- =========================================================
-- 2) ดึง host จาก latest report ของ task นี้
-- =========================================================
LatestTaskHosts AS (
  SELECT DISTINCT
    COALESCE(NULLIF(BTRIM(t.name), ''), '-') AS task_name,
    COALESCE(NULLIF(BTRIM(r.host), ''), '') AS host_ip
  FROM InputTaskLatestReport itlr
  JOIN public.results r
    ON r.report = itlr.report_id
  LEFT JOIN public.tasks t
    ON t.id = itlr.task_id
  WHERE r.host IS NOT NULL
    AND BTRIM(r.host) <> ''
)

-- =========================================================
-- 3) ส่งออกแค่ Hostname, IP
-- =========================================================
SELECT
  lth.task_name AS hostname,
  lth.host_ip AS ip
FROM LatestTaskHosts lth
ORDER BY lth.host_ip ASC;
`

	results := make([]TaskByTaskIDItem, 0)
	if err := db.Raw(query, taskID).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "failed to list task by task id",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": results,
	})
}

