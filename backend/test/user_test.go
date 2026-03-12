package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppUserInput(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
		PhoneNumber: "0812345678",
		Location:    "Bangkok",
		Position:    "Developer",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(u)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppUserEmailRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserEmailFormat(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "invalid-email",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserPasswordRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserPasswordMinLength(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "1234",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserFirstNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserLastNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "",
		Profile:     "This is profile text",
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

func TestInvalidAppUserProfileRequired(t *testing.T) {
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

func TestInvalidAppUserPhoneNumberRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserLocationRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserPositionRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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

func TestInvalidAppUserAppRoleIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	u := entity.AppUser{
		Email:       "test@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "This is profile text",
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