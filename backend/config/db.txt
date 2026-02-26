package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Tawunchai/openvas/entity" // ✅ แก้เป็น path module ของคุณจริง ๆ

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectDB() {
	// แนะนำให้ใช้ env ก่อน ถ้าไม่มีค่อย fallback
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// ตัวอย่าง local dev / docker network
		dsn = "host=pg-gvm port=5432 user=pbi password=Pbi12345 dbname=gvmd sslmode=disable"
	}

	var database *gorm.DB
	var err error

	maxRetries := 20
	retryDelay := 2 * time.Second

	for i := 1; i <= maxRetries; i++ {
		database, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			sqlDB, err2 := database.DB()
			if err2 == nil {
				// Connection pool config
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
		&entity.AppLineMaster{},
		&entity.Notification{},
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

	// Group
	group1 := entity.AppGroup{GroupName: "ITS Group"}
	db.FirstOrCreate(&group1, &entity.AppGroup{GroupName: "ITS Group"})

	// LineMaster
	lineMaster1 := entity.AppLineMaster{Token: "G4crCc/2gMnvX+hZErxIhg7WcI0ML+MRLlAj086lTtrdL7VYURieWPRXKd6/9Zl8RxcaME5vQ3I1BW82d1/ZYezvWklVMUk+EGGfXRmI4jwtA28iaHU8MkneAGQSibyr/yp0eetvASPPtplCXWrb7gdB04t89/1O/w1cDnyilFU="}
	db.FirstOrCreate(&lineMaster1, &entity.AppLineMaster{Token: "G4crCc/2gMnvX+hZErxIhg7WcI0ML+MRLlAj086lTtrdL7VYURieWPRXKd6/9Zl8RxcaME5vQ3I1BW82d1/ZYezvWklVMUk+EGGfXRmI4jwtA28iaHU8MkneAGQSibyr/yp0eetvASPPtplCXWrb7gdB04t89/1O/w1cDnyilFU="})

	// Notification (GroupID เป็น *uint ต้องใส่ pointer)
	notification1 := entity.Notification{
		Name:         "Get on Technology",
		UserID:       "U3af93a2f92b1048757172584d47571c8",
		Alert:        true,
		AppGroupID:   &group1.ID,      // ✅ เปลี่ยนตรงนี้
		AppLineMasterID: lineMaster1.ID,
	}

	db.FirstOrCreate(&notification1, &entity.Notification{
		Name:         "Get on Technology",
		UserID:       "U3af93a2f92b1048757172584d47571c8",
		Alert:        true,
		AppGroupID:   &group1.ID,      // ✅ เปลี่ยนตรงนี้
		AppLineMasterID: lineMaster1.ID,
	})

	fmt.Println("✅ SeedDatabase completed")
}