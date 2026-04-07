package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppGroupInput(t *testing.T) {
	g := NewGomegaWithT(t)

	group := entity.AppGroup{
		GroupName: "Network Team",
	}

	ok, err := govalidator.ValidateStruct(group)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppGroupNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	group := entity.AppGroup{
		GroupName: "",
	}

	ok, err := govalidator.ValidateStruct(group)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("GroupName is required"))
}