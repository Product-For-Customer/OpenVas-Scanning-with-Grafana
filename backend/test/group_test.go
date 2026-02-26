package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

//
// ========================= Group =========================
//

func TestValidGroupInput(t *testing.T) {
	g := NewGomegaWithT(t)

	gr := entity.AppGroup{
		GroupName: "ICU Team",
	}

	ok, err := govalidator.ValidateStruct(gr)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidGroupName(t *testing.T) {
	g := NewGomegaWithT(t)

	gr := entity.AppGroup{
		GroupName: "",
	}

	ok, err := govalidator.ValidateStruct(gr)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Group name is required"))
}