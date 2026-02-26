package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

//
// ========================= LineMaster =========================
//

func TestValidLineMasterInput(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLineMaster{
		Token: "line_notify_token_123",
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidLineMasterToken(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLineMaster{
		Token: "",
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Token is required"))
}