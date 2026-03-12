package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppStatusNotifyInput(t *testing.T) {
	g := NewGomegaWithT(t)

	s := entity.AppStatusNotify{
		Status: "Success",
	}

	ok, err := govalidator.ValidateStruct(s)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppStatusNotifyStatusRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	s := entity.AppStatusNotify{
		Status: "",
	}

	ok, err := govalidator.ValidateStruct(s)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Status is required"))
}