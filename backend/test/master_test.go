package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppLineMasterInput(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLineMaster{
		Name:  "Line Notify Main",
		Token: "line_notify_token_123",
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppLineMasterNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLineMaster{
		Name:  "",
		Token: "line_notify_token_123",
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name is required"))
}

func TestInvalidAppLineMasterTokenRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLineMaster{
		Name:  "Line Notify Main",
		Token: "",
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Token is required"))
}