# MySCanner - คู่มือติดตั้ง (On-Premise)

## ความต้องการของระบบ

| รายการ | ข้อกำหนด |
|--------|----------|
| OS | Windows 10 / Windows 11 (64-bit) |
| RAM | ขั้นต่ำ 8 GB (แนะนำ 16 GB) |
| Disk | ขั้นต่ำ 50 GB ว่าง |
| Network | ต้องต่ออินเทอร์เน็ตได้ (ดาวน์โหลด Greenbone feeds) |
| Software | Docker Desktop ติดตั้งแล้วและกำลังทำงาน |

---

## โครงสร้างไฟล์

```
release/
├── images/
│   ├── myscanner-backend-1.0.0.tar
│   └── myscanner-frontend-1.0.0.tar
├── scripts/
│   ├── install.ps1     ← ติดตั้งครั้งแรก
│   ├── start.ps1       ← เริ่มบริการ
│   ├── stop.ps1        ← หยุดบริการ
│   └── status.ps1      ← ตรวจสอบสถานะ
├── .env                ← ถูกสร้างอัตโนมัติหลัง install
├── .env.template       ← ตัวอย่าง config (ห้ามลบ)
├── db.sql
├── docker-compose.release.yml
└── README.md
```

---

## ขั้นตอนการติดตั้ง

### 1. เตรียม Docker Desktop
- ติดตั้ง Docker Desktop จาก https://www.docker.com/products/docker-desktop
- เปิด Docker Desktop และรอจนสถานะเป็น "Running"

### 2. เปิด PowerShell ในฐานะ Administrator
- กด `Win + X` → เลือก "Windows PowerShell (Admin)"
- หรือค้นหา "PowerShell" แล้วคลิกขวา → "Run as administrator"

### 3. รันสคริปต์ติดตั้ง
```powershell
cd C:\path\to\release
.\scripts\install.ps1
```

### 4. กรอก IP ของเซิร์ฟเวอร์
```
Enter this server's IP address (e.g. 192.168.1.100):
  Server IP: 192.168.1.50
```

### 5. รอติดตั้งเสร็จ
ระบบจะ:
- โหลด Docker images
- สร้าง secrets อัตโนมัติ (JWT, token, รหัสผ่าน DB)
- เริ่มต้น services ทั้งหมด

**หมายเหตุ:** การเริ่มใช้งานครั้งแรกอาจใช้เวลา 20-30 นาที เนื่องจากระบบกำลังดาวน์โหลด Greenbone vulnerability feeds

---

## การใช้งานหลังติดตั้ง

| บริการ | URL |
|--------|-----|
| หน้าเว็บหลัก (Frontend) | `http://YOUR_IP:5173` |
| Backend API | `http://YOUR_IP:9000` |
| OpenVAS | `http://YOUR_IP:9392` |

### คำสั่งจัดการ
```powershell
# เริ่มบริการ
.\scripts\start.ps1

# หยุดบริการ
.\scripts\stop.ps1

# ตรวจสอบสถานะ
.\scripts\status.ps1
```

---

## ข้อควรระวัง

- **ไฟล์ `.env`** มี secrets ของระบบ — **ห้ามส่งต่อหรือเปิดเผยแก่บุคคลอื่น**
- **ห้ามลบ** โฟลเดอร์ `images/` — จำเป็นสำหรับการติดตั้งใหม่
- หากต้องการเปลี่ยน IP ใหม่ ให้รัน `install.ps1` อีกครั้ง

---

## การแก้ปัญหาเบื้องต้น

**Docker ไม่ทำงาน:**
```powershell
docker info
```

**Services ไม่ขึ้น:**
```powershell
docker compose -f docker-compose.release.yml logs --tail=50
```

**Port ถูกใช้งานอยู่:**
- ตรวจสอบว่า port `5173`, `9000`, `9392` ไม่ได้ถูกใช้งานโดยโปรแกรมอื่น
