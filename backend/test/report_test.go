package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppReportInput(t *testing.T) {
	g := NewGomegaWithT(t)

	report := entity.AppReport{
		CompanyName: "OpenAI Security",
		Logo:        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
	}

	ok, err := govalidator.ValidateStruct(report)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppReportCompanyNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	report := entity.AppReport{
		CompanyName: "",
		Logo:        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
	}

	ok, err := govalidator.ValidateStruct(report)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("CompanyName is required"))
}

func TestInvalidAppReportLogoRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	report := entity.AppReport{
		CompanyName: "OpenAI Security",
		Logo:        "",
	}

	ok, err := govalidator.ValidateStruct(report)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Logo is required"))
}

func TestInvalidAppReportMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	report := entity.AppReport{
		CompanyName: "",
		Logo:        "",
	}

	ok, err := govalidator.ValidateStruct(report)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}