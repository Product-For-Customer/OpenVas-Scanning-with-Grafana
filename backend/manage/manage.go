package manage

// TargetLimit คือจำนวน Target / Task สูงสุดที่ระบบอนุญาตให้สร้างได้
//
// วิธีแก้ค่า:
// - ใส่เป็นเลขจำนวนเต็มเท่านั้น เช่น 10, 50, 100
// - ห้ามใส่ค่าติดลบ เช่น -1
// - ห้ามใส่ทศนิยม เช่น 10.5
// - ห้ามใส่ตัวอักษรหรือ string เช่น "10"
const TargetLimit = 8

// เช็กว่า TargetLimit ต้องเป็นจำนวนเต็ม
// ถ้าใส่ 10.5 หรือ "10" จะ compile ไม่ผ่าน
const _ int = TargetLimit

// เช็กว่า TargetLimit ต้องไม่ติดลบ
// ถ้าใส่ -1 จะ compile ไม่ผ่าน
const _ = uint(TargetLimit)

// GetTargetLimit ใช้สำหรับดึงค่า Target Limit ไปใช้ในไฟล์อื่น
func GetTargetLimit() int {
	return TargetLimit
}

// CanCreateTarget ใช้ตรวจสอบว่าสามารถสร้าง Target / Task เพิ่มได้หรือไม่
func CanCreateTarget(currentTargetCount int) bool {
	return currentTargetCount < TargetLimit
}

// IsTargetLimitReached ใช้ตรวจสอบว่าถึง Limit แล้วหรือยัง
func IsTargetLimitReached(currentTargetCount int) bool {
	return currentTargetCount >= TargetLimit
}