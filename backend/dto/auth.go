package dto

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type MeResponse struct {
	ID        uint   `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Profile   string `json:"profile"`
	Phone     string `json:"phone_number"`
	Location  string `json:"location"`
	Position  string `json:"position"`
	Role      string `json:"role"`
}