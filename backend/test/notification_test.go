package unit

import (
	"testing"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

	"github.com/Tawunchai/openvas/entity"
)

func TestValidAppNotificationInput(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Notify Switch Down",
		SendID:          "group_or_user_id",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}

func TestInvalidAppNotificationNameRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "",
		SendID:          "group_or_user_id",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Name is required"))
}

func TestInvalidAppNotificationSendIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Notify Switch Down",
		SendID:          "",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("SendID is required"))
}

func TestInvalidAppNotificationAlertRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Notify Switch Down",
		SendID:          "group_or_user_id",
		Alert:           false,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Alert is required"))
}

func TestInvalidAppNotificationIsGroupRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Notify Switch Down",
		SendID:          "group_or_user_id",
		Alert:           true,
		IsGroup:         false,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("IsGroup is required"))
}

func TestInvalidAppNotificationAppLineMasterIDRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Notify Switch Down",
		SendID:          "group_or_user_id",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 0,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("AppLineMasterID is required"))
}

func TestValidAppNotificationAlertTrueIsValid(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Alert True Test",
		SendID:          "send-id-001",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
	g.Expect(n.Alert).To(BeTrue())
}

func TestInvalidAppNotificationAlertFalseFailsBecauseRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Alert False Test",
		SendID:          "send-id-002",
		Alert:           false,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Alert is required"))
}

func TestValidAppNotificationIsGroupTrueIsValid(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "IsGroup True Test",
		SendID:          "group-id-001",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
	g.Expect(n.IsGroup).To(BeTrue())
}

func TestInvalidAppNotificationIsGroupFalseFailsBecauseRequired(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "IsGroup False Test",
		SendID:          "user-id-001",
		Alert:           true,
		IsGroup:         false,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("IsGroup is required"))
}

func TestValidAppNotificationAlertAndIsGroupCombination1(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Combination 1",
		SendID:          "id-1",
		Alert:           true,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
	g.Expect(n.Alert).To(BeTrue())
	g.Expect(n.IsGroup).To(BeTrue())
}

func TestInvalidAppNotificationAlertAndIsGroupCombination2(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Combination 2",
		SendID:          "id-2",
		Alert:           true,
		IsGroup:         false,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("IsGroup is required"))
}

func TestInvalidAppNotificationAlertAndIsGroupCombination3(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Combination 3",
		SendID:          "id-3",
		Alert:           false,
		IsGroup:         true,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Alert is required"))
}

func TestInvalidAppNotificationAlertAndIsGroupCombination4(t *testing.T) {
	g := NewGomegaWithT(t)

	n := entity.AppNotification{
		Name:            "Combination 4",
		SendID:          "id-4",
		Alert:           false,
		IsGroup:         false,
		AppLineMasterID: 1,
	}

	ok, err := govalidator.ValidateStruct(n)
	g.Expect(ok).To(BeFalse())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(ContainSubstring("Alert is required"))
}