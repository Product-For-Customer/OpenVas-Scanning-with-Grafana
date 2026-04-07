package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppUserInput(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppUserEmailRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is required"))
}

func TestInvalidAppUserEmailFormat(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin-example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is invalid"))
}

func TestInvalidAppUserPasswordRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Password is required"))
}

func TestInvalidAppUserPasswordMinLength(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "1234567",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Password must be at least 8 characters"))
}

func TestInvalidAppUserFirstNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("FirstName is required"))
}

func TestInvalidAppUserLastNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("LastName is required"))
}

func TestInvalidAppUserProfileRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Profile is required"))
}

func TestInvalidAppUserPhoneNumberRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("PhoneNumber is required"))
}

func TestInvalidAppUserLocationRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "",
		Position:    "Administrator",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Location is required"))
}

func TestInvalidAppUserPositionRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "",
		AppRoleID:   1,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Position is required"))
}

func TestInvalidAppUserAppRoleIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "admin@example.com",
		Password:    "12345678",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		Profile:     "https://example.com/profile.jpg",
		PhoneNumber: "0999999999",
		Location:    "Nakhon Ratchasima",
		Position:    "Administrator",
		AppRoleID:   0,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("AppRoleID is required"))
}

func TestInvalidAppUserMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	user := entity.AppUser{
		Email:       "",
		Password:    "",
		FirstName:   "",
		LastName:    "",
		Profile:     "",
		PhoneNumber: "",
		Location:    "",
		Position:    "",
		AppRoleID:   0,
	}

	ok, err := govalidator.ValidateStruct(user)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}