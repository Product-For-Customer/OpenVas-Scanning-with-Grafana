package user

import (
	"net/http"
	"strconv"

	"github.com/Tawunchai/openvas/config"
	"github.com/Tawunchai/openvas/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

func ListUser(c *gin.Context) {
	var users []entity.AppUser

	db := config.DB()
	results := db.Preload("AppRole").Find(&users)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
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

	c.JSON(http.StatusOK, user)
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
	result := db.First(&user, uint(uid))
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// ถ้าไม่มี field ส่งมาเลย
	if input.Email == nil &&
		input.Password == nil &&
		input.FirstName == nil &&
		input.LastName == nil &&
		input.Profile == nil &&
		input.PhoneNumber == nil &&
		input.Location == nil &&
		input.Position == nil &&
		input.AppRoleID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no data to update"})
		return
	}

	// สร้างข้อมูลจำลองจากค่าปัจจุบัน + ค่าที่ส่งมาใหม่
	validateUser := user

	if input.Email != nil {
		validateUser.Email = *input.Email
	}
	if input.Password != nil {
		validateUser.Password = *input.Password
	}
	if input.FirstName != nil {
		validateUser.FirstName = *input.FirstName
	}
	if input.LastName != nil {
		validateUser.LastName = *input.LastName
	}
	if input.Profile != nil {
		validateUser.Profile = *input.Profile
	}
	if input.PhoneNumber != nil {
		validateUser.PhoneNumber = *input.PhoneNumber
	}
	if input.Location != nil {
		validateUser.Location = *input.Location
	}
	if input.Position != nil {
		validateUser.Position = *input.Position
	}
	if input.AppRoleID != nil {
		validateUser.AppRoleID = *input.AppRoleID
	}

	// validate ด้วย govalidator ตาม tag ใน entity
	if ok, err := govalidator.ValidateStruct(validateUser); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}

	if input.Email != nil {
		updates["email"] = *input.Email
	}
	if input.Password != nil {
		updates["password"] = *input.Password
	}
	if input.FirstName != nil {
		updates["first_name"] = *input.FirstName
	}
	if input.LastName != nil {
		updates["last_name"] = *input.LastName
	}
	if input.Profile != nil {
		updates["profile"] = *input.Profile
	}
	if input.PhoneNumber != nil {
		updates["phone_number"] = *input.PhoneNumber
	}
	if input.Location != nil {
		updates["location"] = *input.Location
	}
	if input.Position != nil {
		updates["position"] = *input.Position
	}
	if input.AppRoleID != nil {
		updates["app_role_id"] = *input.AppRoleID
	}

	if err := db.Model(&user).Updates(updates).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var updatedUser entity.AppUser
	if err := db.Preload("AppRole").First(&updatedUser, uint(uid)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch updated user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user updated successfully",
		"data":    updatedUser,
	})
}

func DeleteUserByID(c *gin.Context) {
	id := c.Param("id")

	uid, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	db := config.DB()

	var user entity.AppUser
	result := db.First(&user, uint(uid))
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if err := db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user deleted successfully",
	})
}