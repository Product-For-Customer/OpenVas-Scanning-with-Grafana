package user

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/Tawunchai/openvas/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateUserInput struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	Profile     string `json:"profile" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	Location    string `json:"location" binding:"required"`
	Position    string `json:"position" binding:"required"`
	AppRoleID   uint   `json:"app_role_id" binding:"required"`
}

type UpdateUserInput struct {
	Email       *string `json:"email"`
	Password    *string `json:"password"`
	FirstName   *string `json:"first_name"`
	LastName    *string `json:"last_name"`
	Profile     *string `json:"profile"`
	PhoneNumber *string `json:"phone_number"`
	Location    *string `json:"location"`
	Position    *string `json:"position"`
	AppRoleID   *uint   `json:"app_role_id"`
}

type UserResponse struct {
	ID          uint   `json:"id"`
	Email       string `json:"email"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Profile     string `json:"profile"`
	PhoneNumber string `json:"phone_number"`
	Location    string `json:"location"`
	Position    string `json:"position"`
	Role        string `json:"role"`
}

func mapUserResponse(u entity.AppUser) UserResponse {
	role := ""
	if u.AppRole != nil {
		role = u.AppRole.Role
	}

	return UserResponse{
		ID:          u.ID,
		Email:       u.Email,
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		Profile:     u.Profile,
		PhoneNumber: u.PhoneNumber,
		Location:    u.Location,
		Position:    u.Position,
		Role:        role,
	}
}

func CreateUser(c *gin.Context) {
	var input CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var existing entity.AppUser
	if err := db.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email already exists"})
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	user := entity.AppUser{
		Email:       input.Email,
		Password:    hashedPassword,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		Profile:     input.Profile,
		PhoneNumber: input.PhoneNumber,
		Location:    input.Location,
		Position:    input.Position,
		AppRoleID:   input.AppRoleID,
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("AppRole").First(&user, user.ID)

	c.JSON(http.StatusCreated, mapUserResponse(user))
}

func ListUser(c *gin.Context) {
	var users []entity.AppUser

	db := config.DB()
	results := db.Preload("AppRole").Find(&users)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	response := make([]UserResponse, 0, len(users))
	for _, u := range users {
		response = append(response, mapUserResponse(u))
	}

	c.JSON(http.StatusOK, response)
}

func ListUserByID(c *gin.Context) {
	id := c.Param("id")

	uid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var user entity.AppUser

	db := config.DB()
	result := db.Preload("AppRole").First(&user, uint(uid))
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, mapUserResponse(user))
}

func UpdateUserByID(c *gin.Context) {
	id := c.Param("id")

	uid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var input UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var user entity.AppUser
	if err := db.Preload("AppRole").First(&user, uint(uid)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if input.Email != nil {
		user.Email = *input.Email
	}
	if input.FirstName != nil {
		user.FirstName = *input.FirstName
	}
	if input.LastName != nil {
		user.LastName = *input.LastName
	}
	if input.Profile != nil {
		user.Profile = *input.Profile
	}
	if input.PhoneNumber != nil {
		user.PhoneNumber = *input.PhoneNumber
	}
	if input.Location != nil {
		user.Location = *input.Location
	}
	if input.Position != nil {
		user.Position = *input.Position
	}
	if input.AppRoleID != nil {
		user.AppRoleID = *input.AppRoleID
	}
	if input.Password != nil && *input.Password != "" {
		hashedPassword, err := utils.HashPassword(*input.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
			return
		}
		user.Password = hashedPassword
	}

	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("AppRole").First(&user, user.ID)

	c.JSON(http.StatusOK, mapUserResponse(user))
}

func DeleteUserByID(c *gin.Context) {
	id := c.Param("id")

	uid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	db := config.DB()
	if tx := db.Delete(&entity.AppUser{}, uint(uid)); tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": tx.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user deleted successfully"})
}


//
type RoleResponse struct {
	ID   uint   `json:"id"`
	Role string `json:"role"`
}

type UpdateUserByAdminInput struct {
	Email       *string `json:"email"`
	Password    *string `json:"password"`
	FirstName   *string `json:"first_name"`
	LastName    *string `json:"last_name"`
	Profile     *string `json:"profile"`
	PhoneNumber *string `json:"phone_number"`
	Location    *string `json:"location"`
	Position    *string `json:"position"`
	AppRoleID   *uint   `json:"app_role_id"`
}


func ListRoles(c *gin.Context) {
	var roles []entity.AppRole

	db := config.DB()
	if err := db.Order("id asc").Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to list roles",
		})
		return
	}

	response := make([]RoleResponse, 0, len(roles))
	for _, role := range roles {
		response = append(response, RoleResponse{
			ID:   role.ID,
			Role: role.Role,
		})
	}

	c.JSON(http.StatusOK, response)
}

func UpdateUserIDByAdmin(c *gin.Context) {
	id := c.Param("id")

	uid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})
		return
	}

	var input UpdateUserByAdminInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := config.DB()

	var user entity.AppUser
	if err := db.Preload("AppRole").First(&user, uint(uid)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	updates := map[string]interface{}{}

	if input.Email != nil {
		newEmail := strings.TrimSpace(*input.Email)
		if newEmail == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "email cannot be empty",
			})
			return
		}

		var existing entity.AppUser
		err := db.Where("email = ? AND id <> ?", newEmail, user.ID).First(&existing).Error
		if err == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "email already exists",
			})
			return
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to check existing email",
			})
			return
		}

		updates["Email"] = newEmail
	}

	if input.FirstName != nil {
		updates["FirstName"] = strings.TrimSpace(*input.FirstName)
	}

	if input.LastName != nil {
		updates["LastName"] = strings.TrimSpace(*input.LastName)
	}

	if input.Profile != nil {
		updates["Profile"] = strings.TrimSpace(*input.Profile)
	}

	if input.PhoneNumber != nil {
		updates["PhoneNumber"] = strings.TrimSpace(*input.PhoneNumber)
	}

	if input.Location != nil {
		updates["Location"] = strings.TrimSpace(*input.Location)
	}

	if input.Position != nil {
		updates["Position"] = strings.TrimSpace(*input.Position)
	}

	if input.AppRoleID != nil {
		var role entity.AppRole
		if err := db.First(&role, *input.AppRoleID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "role not found",
			})
			return
		}

		updates["AppRoleID"] = *input.AppRoleID
	}

	if input.Password != nil {
		newPassword := strings.TrimSpace(*input.Password)
		if newPassword != "" {
			hashedPassword, err := utils.HashPassword(newPassword)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "failed to hash password",
				})
				return
			}
			updates["Password"] = hashedPassword
		}
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "no fields to update",
		})
		return
	}

	tx := db.Model(&entity.AppUser{}).
		Where("id = ?", user.ID).
		Updates(updates)

	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": tx.Error.Error(),
		})
		return
	}

	var updatedUser entity.AppUser
	if err := db.Preload("AppRole").First(&updatedUser, user.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to reload updated user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "update user by admin success",
		"data":    mapUserResponse(updatedUser),
	})
}