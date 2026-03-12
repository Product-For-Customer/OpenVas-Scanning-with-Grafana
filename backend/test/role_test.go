package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppRoleInput(t *testing.T) {
	g := NewGomegaWithT(t)

	r := entity.AppRole{
		Role: "Admin",
	}

	ok, err := govalidator.ValidateStruct(r)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppRoleRoleRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	r := entity.AppRole{
		Role: "",
	}

	ok, err := govalidator.ValidateStruct(r)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Role is required"))
}