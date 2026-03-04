package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

//
// ========================= AppUser =========================
//

// ✅ valid: ข้อมูลครบทั้งหมด
func TestValidAppUserInput(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

// --------- Email required ---------
func TestInvalidAppUserEmailRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is required"))
}

// --------- Email format invalid ---------
func TestInvalidAppUserEmailFormat(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "invalid-email",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is invalid"))
}

// --------- Password required ---------
func TestInvalidAppUserPasswordRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Password is required"))
}

// --------- Password too short ---------
func TestInvalidAppUserPasswordMinLength(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "1234",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Password must be at least 8 characters"))
}

// --------- FirstName ---------
func TestInvalidAppUserFirstName(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("FirstName is required"))
}

// --------- LastName ---------
func TestInvalidAppUserLastName(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("LastName is required"))
}

// --------- Profile ---------
func TestInvalidAppUserProfile(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Profile is required"))
}

// --------- PhoneNumber ---------
func TestInvalidAppUserPhoneNumber(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("PhoneNumber is required"))
}

// --------- Location ---------
func TestInvalidAppUserLocation(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Location is required"))
}

// --------- Position ---------
func TestInvalidAppUserPosition(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Position is required"))
}

// --------- AppRoleID ---------
func TestInvalidAppUserAppRoleID(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "profile.png",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   0,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("AppRoleID is required"))
}