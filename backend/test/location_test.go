package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppLocationInput(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "Building A",
		Floor:      3,
		Location:   "North Wing",
		Latitude:   13.7563,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppLocationNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "",
		Building:   "Building A",
		Floor:      3,
		Location:   "North Wing",
		Latitude:   13.7563,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name name is required"))
}

func TestInvalidAppLocationBuildingRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "",
		Floor:      3,
		Location:   "North Wing",
		Latitude:   13.7563,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Building is required"))
}

func TestInvalidAppLocationFloorRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "Building A",
		Floor:      0,
		Location:   "North Wing",
		Latitude:   13.7563,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Floor is required"))
}

func TestInvalidAppLocationLocationRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "Building A",
		Floor:      3,
		Location:   "",
		Latitude:   13.7563,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Location is required"))
}

func TestInvalidAppLocationLatitudeRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "Building A",
		Floor:      3,
		Location:   "North Wing",
		Latitude:   0,
		Longtitude: 100.5018,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Latitude is required"))
}

func TestInvalidAppLocationLongtitudeRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	l := entity.AppLocation{
		Name:       "Server Room",
		Building:   "Building A",
		Floor:      3,
		Location:   "North Wing",
		Latitude:   13.7563,
		Longtitude: 0,
	}

	ok, err := govalidator.ValidateStruct(l)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Longtitude is required"))
}