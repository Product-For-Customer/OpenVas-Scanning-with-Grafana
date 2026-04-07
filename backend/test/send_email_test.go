package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidSendEmailInput(t *testing.T) {
	g := NewGomegaWithT(t)

	sendEmail := entity.SendEmail{
		Email:   "admin@example.com",
		PassApp: "app-password-123",
	}

	ok, err := govalidator.ValidateStruct(sendEmail)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidSendEmailRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	sendEmail := entity.SendEmail{
		Email:   "",
		PassApp: "app-password-123",
	}

	ok, err := govalidator.ValidateStruct(sendEmail)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is required"))
}

func TestInvalidSendEmailFormat(t *testing.T) {
	g := NewGomegaWithT(t)

	sendEmail := entity.SendEmail{
		Email:   "admin-example.com",
		PassApp: "app-password-123",
	}

	ok, err := govalidator.ValidateStruct(sendEmail)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Email is invalid"))
}

func TestInvalidSendEmailPassAppRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	sendEmail := entity.SendEmail{
		Email:   "admin@example.com",
		PassApp: "",
	}

	ok, err := govalidator.ValidateStruct(sendEmail)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("PassApp is required"))
}

func TestInvalidSendEmailMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	sendEmail := entity.SendEmail{
		Email:   "",
		PassApp: "",
	}

	ok, err := govalidator.ValidateStruct(sendEmail)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}