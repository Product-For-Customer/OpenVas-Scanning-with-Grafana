package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppDiagramInput(t *testing.T) {
	g := NewGomegaWithT(t)

	diagram := entity.AppDiagram{
		Name:        "Network Topology",
		Description: "Main office network diagram",
		ImageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
	}

	ok, err := govalidator.ValidateStruct(diagram)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppDiagramNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	diagram := entity.AppDiagram{
		Name:        "",
		Description: "Main office network diagram",
		ImageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
	}

	ok, err := govalidator.ValidateStruct(diagram)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name is required"))
}

func TestInvalidAppDiagramImageBase64Required(t *testing.T) {
	g := NewGomegaWithT(t)

	diagram := entity.AppDiagram{
		Name:        "Network Topology",
		Description: "Main office network diagram",
		ImageBase64: "",
	}

	ok, err := govalidator.ValidateStruct(diagram)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("ImageBase64 is required"))
}

func TestValidAppDiagramDescriptionOptional(t *testing.T) {
	g := NewGomegaWithT(t)

	diagram := entity.AppDiagram{
		Name:        "Network Topology",
		Description: "",
		ImageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
	}

	ok, err := govalidator.ValidateStruct(diagram)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppDiagramMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	diagram := entity.AppDiagram{
		Name:        "",
		Description: "",
		ImageBase64: "",
	}

	ok, err := govalidator.ValidateStruct(diagram)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}