package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Tawunchai/openvas/entity"
	"github.com/Tawunchai/openvas/utils"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=pg-gvm port=5432 user=pbi password=Pbi12345 dbname=gvmd sslmode=disable"
	}

	// ✅ ปิดการพิมพ์ SQL + ปิดสี
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             2 * time.Second,
			LogLevel:                  logger.Silent,
			IgnoreRecordNotFoundError: true,
			Colorful:                  false,
		},
	)

	var database *gorm.DB
	var err error

	maxRetries := 20
	retryDelay := 2 * time.Second

	for i := 1; i <= maxRetries; i++ {
		database, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})

		if err == nil {
			sqlDB, err2 := database.DB()
			if err2 == nil {
				sqlDB.SetMaxIdleConns(5)
				sqlDB.SetMaxOpenConns(20)
				sqlDB.SetConnMaxLifetime(30 * time.Minute)

				if pingErr := sqlDB.Ping(); pingErr == nil {
					db = database
					fmt.Println("✅ Database connected successfully")
					return
				} else {
					err = pingErr
				}
			} else {
				err = err2
			}
		}

		log.Printf("⏳ DB not ready (attempt %d/%d): %v\n", i, maxRetries, err)
		time.Sleep(retryDelay)
	}

	log.Fatalf("❌ failed to connect to PostgreSQL after %d attempts: %v", maxRetries, err)
}

// ✅ สร้างตารางจาก Entity
func SetupDatabase() {
	if db == nil {
		log.Fatal("❌ database is nil, call ConnectDB() before SetupDatabase()")
	}

	err := db.AutoMigrate(
		&entity.AppGroup{},
		&entity.OTP{},
		&entity.SendEmail{},
		&entity.AppLineMaster{},
		&entity.AppNotification{},
		&entity.AppRole{},
		&entity.AppUser{},
		&entity.AppStatusNotify{},
		&entity.AppHistoryNotify{},
	)
	if err != nil {
		log.Fatalf("❌ AutoMigrate failed: %v", err)
	}

	fmt.Println("✅ AutoMigrate completed (AppGroup, AppLineMaster, Notification)")
}

func SeedDatabase() {
	if db == nil {
		log.Fatal("❌ database is nil, call ConnectDB() before SeedDatabase()")
	}

	// =========================
	// Seed Roles
	// =========================
	adminRole := entity.AppRole{Role: "Admin"}
	userRole := entity.AppRole{Role: "User"}

	db.FirstOrCreate(&adminRole, &entity.AppRole{Role: "Admin"})
	db.FirstOrCreate(&userRole, &entity.AppRole{Role: "User"})

	// =========================
	// Seed StatusNotify
	// =========================
	StatusNotify1 := entity.AppStatusNotify{Status: "Update Completed"}
	StatusNotify2 := entity.AppStatusNotify{Status: "No Update"}
	StatusNotify3 := entity.AppStatusNotify{Status: "Already Running"}
	StatusNotify4 := entity.AppStatusNotify{Status: "Update Failed"}
	StatusNotify5 := entity.AppStatusNotify{Status: "Status Notification"}

	db.FirstOrCreate(&StatusNotify1, &entity.AppStatusNotify{Status: "Update Completed"})
	db.FirstOrCreate(&StatusNotify2, &entity.AppStatusNotify{Status: "No Update"})
	db.FirstOrCreate(&StatusNotify3, &entity.AppStatusNotify{Status: "Already Running"})
	db.FirstOrCreate(&StatusNotify4, &entity.AppStatusNotify{Status: "Update Failed"})
	db.FirstOrCreate(&StatusNotify5, &entity.AppStatusNotify{Status: "Status Notification"})

	send := &entity.SendEmail{
		Email:   "b6534240@g.sut.ac.th",
		PassApp: "wkeg dbhx tllh mtif",
	}

	db.FirstOrCreate(send, entity.SendEmail{Email: send.Email})

	// =========================
	// Seed HistoryNotify
	// =========================
	HistoryNotify1 := entity.AppHistoryNotify{
		Subject:         "Vulnerability Found",
		Description:     "A new vulnerability has been detected in the system.",
		AppStatusNotify: &StatusNotify5, // Status Notification
	}
	db.FirstOrCreate(
		&HistoryNotify1,
		&entity.AppHistoryNotify{
			Subject:     "Vulnerability Found",
			Description: "A new vulnerability has been detected in the system.",
		},
	)

	HistoryNotify2 := entity.AppHistoryNotify{
		Subject:         "Scan Completed",
		Description:     "The vulnerability scan has been completed successfully.",
		AppStatusNotify: &StatusNotify1, // Update Completed
	}
	db.FirstOrCreate(
		&HistoryNotify2,
		&entity.AppHistoryNotify{
			Subject:     "Scan Completed",
			Description: "The vulnerability scan has been completed successfully.",
		},
	)

	HistoryNotify3 := entity.AppHistoryNotify{
		Subject:         "Scan Already Running",
		Description:     "The scan process is already running in the system.",
		AppStatusNotify: &StatusNotify3, // Already Running
	}
	db.FirstOrCreate(
		&HistoryNotify3,
		&entity.AppHistoryNotify{
			Subject:     "Scan Already Running",
			Description: "The scan process is already running in the system.",
		},
	)

	HistoryNotify4 := entity.AppHistoryNotify{
		Subject:         "Feed Update Failed",
		Description:     "Security feed data update failed.",
		AppStatusNotify: &StatusNotify4, // Update Failed
	}
	db.FirstOrCreate(
		&HistoryNotify4,
		&entity.AppHistoryNotify{
			Subject:     "Feed Update Failed",
			Description: "Security feed data update failed.",
		},
	)

	HistoryNotify5 := entity.AppHistoryNotify{
		Subject:         "No Feed Update",
		Description:     "There is no new security feed update available.",
		AppStatusNotify: &StatusNotify2, // No Update
	}
	db.FirstOrCreate(
		&HistoryNotify5,
		&entity.AppHistoryNotify{
			Subject:     "No Feed Update",
			Description: "There is no new security feed update available.",
		},
	)

	// =========================
	// Seed Groups
	// =========================
	group1 := entity.AppGroup{GroupName: "ITS Group"}
	db.FirstOrCreate(&group1, &entity.AppGroup{GroupName: "ITS Group"})

	// =========================
	// Seed LineMasters
	// =========================
	lineMaster1 := entity.AppLineMaster{
		Token: "G4crCc/2gMnvX+hZErxIhg7WcI0ML+MRLlAj086lTtrdL7VYURieWPRXKd6/9Zl8RxcaME5vQ3I1BW82d1/ZYezvWklVMUk+EGGfXRmI4jwtA28iaHU8MkneAGQSibyr/yp0eetvASPPtplCXWrb7gdB04t89/1O/w1cDnyilFU=",
	}
	db.FirstOrCreate(&lineMaster1, &entity.AppLineMaster{Token: lineMaster1.Token})

	// =========================
	// Seed Notifications
	// =========================
	notification1 := entity.AppNotification{
		Name:            "Get on Technology",
		UserID:          "U3af93a2f92b1048757172584d47571c8",
		Alert:           true,
		AppGroupID:      &group1.ID,
		AppLineMasterID: lineMaster1.ID,
	}

	db.FirstOrCreate(&notification1, &entity.AppNotification{
		Name:            notification1.Name,
		UserID:          notification1.UserID,
		Alert:           notification1.Alert,
		AppGroupID:      &group1.ID,
		AppLineMasterID: lineMaster1.ID,
	})

	// =========================
	// Seed Admin User
	// =========================
	var existingAdmin entity.AppUser
	if err := db.Where("email = ?", "tawunchaien@gmail.com").First(&existingAdmin).Error; err != nil {
		hashedPassword, err := utils.HashPassword("12345678")
		if err != nil {
			log.Fatalf("❌ failed to hash seed admin password: %v", err)
		}

		adminUser := entity.AppUser{
			Email:       "tawunchaien@gmail.com",
			Password:    hashedPassword,
			FirstName:   "Admin",
			LastName:    "System",
			Profile:     "Admin Profile",
			PhoneNumber: "0999999999",
			Location:    "Thailand",
			Position:    "Administrator",
			AppRoleID:   adminRole.ID,
		}

		if err := db.Create(&adminUser).Error; err != nil {
			log.Fatalf("❌ failed to create seed admin user: %v", err)
		}
	}

	// =========================
	// Seed User Role 1 Users
	// =========================
	seedUsers := []struct {
		Email       string
		Password    string
		FirstName   string
		LastName    string
		Profile     string
		PhoneNumber string
		Location    string
		Position    string
	}{
		{
			Email:       "user@example.com",
			Password:    "12345678",
			FirstName:   "User",
			LastName:    "One",
			Profile:     "User Profile 1",
			PhoneNumber: "0811111111",
			Location:    "Thailand",
			Position:    "Operator",
		},
	}

	for _, u := range seedUsers {
		var existingUser entity.AppUser
		if err := db.Where("email = ?", u.Email).First(&existingUser).Error; err != nil {
			hashedPassword, hashErr := utils.HashPassword(u.Password)
			if hashErr != nil {
				log.Fatalf("❌ failed to hash password for %s: %v", u.Email, hashErr)
			}

			newUser := entity.AppUser{
				Email:       u.Email,
				Password:    hashedPassword,
				FirstName:   u.FirstName,
				LastName:    u.LastName,
				Profile:     u.Profile,
				PhoneNumber: u.PhoneNumber,
				Location:    u.Location,
				Position:    u.Position,
				AppRoleID:   userRole.ID,
			}

			if err := db.Create(&newUser).Error; err != nil {
				log.Fatalf("❌ failed to create seed user %s: %v", u.Email, err)
			}
		}
	}

	fmt.Println("✅ SeedDatabase completed")
}
