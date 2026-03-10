package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

//
// ========================= Notification =========================
//

// ✅ valid: GroupID ว่างได้ แต่ LineMasterID ต้องมี
func TestValidNotificationInput(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "CPU Alert",
		SendID:       "1",
		Alert:        true, // govalidator required on bool => true ผ่าน
		AppLineMasterID: 1,    // required
		// GroupID: nil // ว่างได้
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

// ✅ valid: มี GroupID ก็ผ่าน
func TestValidNotificationWithGroupID(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "Memory Alert",
		SendID:       "2",
		Alert:        true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

// --------- Name ---------
func TestInvalidNotificationName(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "",
		SendID:       "1",
		Alert:        true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name is required"))
}

// --------- UserID ---------
func TestInvalidNotificationUserID(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "CPU Alert",
		SendID:       "",
		Alert:        true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("UserID is required"))
}

// --------- Alert ---------
func TestInvalidNotificationAlert(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "CPU Alert",
		SendID:       "1",
		Alert:        false, // govalidator required on bool => false fail
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Alert is required"))
}

// --------- LineMasterID (required) ---------
func TestInvalidNotificationLineMasterID(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "CPU Alert",
		SendID:       "1",
		Alert:        true,
		AppLineMasterID: 0, // required on uint => 0 fail
		// AppGroupID ว่างได้
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("AppLineMasterID is required"))
}

// --------- AppGroupID (optional) ---------
func TestValidNotificationWithoutAppGroupID(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:         "Disk Alert",
		SendID:       "99",
		Alert:        true,
		AppLineMasterID: 10,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}