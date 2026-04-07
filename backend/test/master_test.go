package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppLineMasterInput(t *testing.T) {
	g := NewGomegaWithT(t)

	lineMaster := entity.AppLineMaster{
		Name:  "Admin LINE",
		Token: "line-token-123456",
	}

	ok, err := govalidator.ValidateStruct(lineMaster)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppLineMasterNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	lineMaster := entity.AppLineMaster{
		Name:  "",
		Token: "line-token-123456",
	}

	ok, err := govalidator.ValidateStruct(lineMaster)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name is required"))
}

func TestInvalidAppLineMasterTokenRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	lineMaster := entity.AppLineMaster{
		Name:  "Admin LINE",
		Token: "",
	}

	ok, err := govalidator.ValidateStruct(lineMaster)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Token is required"))
}

func TestInvalidAppLineMasterNameAndTokenRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	lineMaster := entity.AppLineMaster{
		Name:  "",
		Token: "",
	}

	ok, err := govalidator.ValidateStruct(lineMaster)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}