package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppDiagramNodeInput(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "task-001",
		Label:       "Firewall",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           100.25,
		Y:           200.50,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppDiagramNodeDiagramIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   0,
		TaskID:      "task-001",
		Label:       "Firewall",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           100.25,
		Y:           200.50,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("DiagramID is required"))
}

func TestInvalidAppDiagramNodeTaskIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "",
		Label:       "Firewall",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           100.25,
		Y:           200.50,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("TaskID is required"))
}

func TestInvalidAppDiagramNodeLabelRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "task-001",
		Label:       "",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           100.25,
		Y:           200.50,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Label is required"))
}

func TestInvalidAppDiagramNodeXRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "task-001",
		Label:       "Firewall",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           0,
		Y:           200.50,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("X is required"))
}

func TestInvalidAppDiagramNodeYRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "task-001",
		Label:       "Firewall",
		Description: "Main firewall node",
		Icon:        "shield",
		X:           100.25,
		Y:           0,
		Width:       120.00,
		Height:      80.00,
		ZIndex:      1,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Y is required"))
}

func TestValidAppDiagramNodeOptionalFields(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   1,
		TaskID:      "task-001",
		Label:       "Firewall",
		Description: "",
		Icon:        "",
		X:           100.25,
		Y:           200.50,
		Width:       0,
		Height:      0,
		ZIndex:      0,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppDiagramNodeMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	node := entity.AppDiagramNode{
		DiagramID:   0,
		TaskID:      "",
		Label:       "",
		Description: "",
		Icon:        "",
		X:           0,
		Y:           0,
		Width:       0,
		Height:      0,
		ZIndex:      0,
	}

	ok, err := govalidator.ValidateStruct(node)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}