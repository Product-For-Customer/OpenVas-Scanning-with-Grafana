package unit

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppHistoryNotifyInput(t *testing.T) {
	g := NewGomegaWithT(t)

	history := entity.AppHistoryNotify{
		Subject:     "High CPU Usage Alert",
		DateTime:    time.Now(),
		Description: "CPU usage exceeded the defined threshold.",
	}

	ok, err := govalidator.ValidateStruct(history)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppHistoryNotifySubjectRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	history := entity.AppHistoryNotify{
		Subject:     "",
		DateTime:    time.Now(),
		Description: "CPU usage exceeded the defined threshold.",
	}

	ok, err := govalidator.ValidateStruct(history)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Subject is required"))
}

func TestInvalidAppHistoryNotifyDateTimeRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	history := entity.AppHistoryNotify{
		Subject:     "High CPU Usage Alert",
		DateTime:    time.Time{},
		Description: "CPU usage exceeded the defined threshold.",
	}

	ok, err := govalidator.ValidateStruct(history)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("DateTime is required"))
}

func TestInvalidAppHistoryNotifyDescriptionRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	history := entity.AppHistoryNotify{
		Subject:     "High CPU Usage Alert",
		DateTime:    time.Now(),
		Description: "",
	}

	ok, err := govalidator.ValidateStruct(history)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Description is required"))
}

func TestInvalidAppHistoryNotifyMultipleFieldsRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	history := entity.AppHistoryNotify{
		Subject:     "",
		DateTime:    time.Time{},
		Description: "",
	}

	ok, err := govalidator.ValidateStruct(history)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
}