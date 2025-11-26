# Security Guidelines & Implementation

## 1. ระบบล็อกอิน & สิทธิ์ใช้งาน

### Password Requirements
- ✅ ความยาวอย่างน้อย 10 ตัวอักษร
- ✅ มีตัวเลขอย่างน้อย 1 ตัว
- ✅ มีตัวพิมพ์ใหญ่และพิมพ์เล็ก
- ✅ มีตัวอักษรพิเศษอย่างน้อย 1 ตัว

### Password Storage (Backend Required)
```typescript
// Backend ต้องใช้ bcrypt หรือ Argon2
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
// เก็บ hashedPassword ในฐานข้อมูล
```

### JWT Token Management
- ✅ Access Token: อายุสั้น (1-2 ชั่วโมง)
- ✅ Refresh Token: แยกจาก Access Token
- ✅ Token validation ที่ backend

### Role-Based Access Control (RBAC)

#### Student
- เห็นเฉพาะข้อมูลของตัวเอง
- เห็นโปรเจกต์ที่ตัวเองเป็นสมาชิก
- เห็น Coaching Sessions ที่ตัวเองเข้าร่วม

#### Advisor
- เห็นข้อมูลของนักศึกษาที่อยู่ในความดูแล
- เห็น Coaching Sessions ที่ตัวเองเป็นผู้ดูแล
- ไม่เห็นข้อมูลของนักศึกษาคนอื่น

#### Admin
- เห็นข้อมูลทั้งหมด
- จัดการผู้ใช้
- ดู Audit Logs

#### Committee
- เห็นเฉพาะโปรเจกต์ที่ได้รับมอบหมายให้ประเมิน
- ไม่เห็นข้อมูลอื่นๆ

### 2FA (Two-Factor Authentication)
- สำหรับ Admin และ Advisor
- ใช้ OTP หรือ Authenticator App
- ต้อง implement ที่ backend

## 2. ป้องกันโจมตีพื้นฐาน (OWASP)

### SQL Injection Prevention
```typescript
// ใช้ Prepared Statements หรือ ORM
// ❌ ไม่ทำแบบนี้:
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ ทำแบบนี้:
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### XSS Prevention
```typescript
// ใช้ sanitizeInput() จาก utils/security.ts
import { sanitizeInput } from '../utils/security';

const safeInput = sanitizeInput(userInput);
```

### CSRF Protection
```typescript
// ใช้ CSRF Token
import { generateCSRFToken } from '../utils/security';

const csrfToken = generateCSRFToken();
// ส่งไปกับทุก request ที่สำคัญ
headers['X-CSRF-Token'] = csrfToken;
```

### Rate Limiting
```typescript
// Backend ต้อง implement rate limiting
// สำหรับ endpoints ที่สำคัญ:
// - /api/auth/login (5 requests/minute)
// - /api/auth/forgot-password (3 requests/hour)
// - /api/files/upload (10 requests/minute)
```

### File Upload Security
- ✅ ตรวจสอบประเภทไฟล์ (PDF, DOCX, PNG, JPG)
- ✅ จำกัดขนาดไฟล์ (10MB)
- ✅ Sanitize filename
- ✅ เก็บไฟล์นอก web root
- ✅ ใช้ signed URLs สำหรับการเข้าถึง

## 3. การปกป้องข้อมูล

### HTTPS
- ✅ บังคับใช้ HTTPS ทุกหน้า
- ✅ ตั้ง HSTS header
```nginx
# Nginx configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Data Encryption
```typescript
// ข้อมูลสำคัญต้องเข้ารหัส
// - เลขบัตรประชาชน
// - เบอร์โทรศัพท์
// - Email (อาจเข้ารหัส)
```

### Environment Variables
```bash
# .env file (ห้าม commit ขึ้น Git)
DATABASE_URL=...
JWT_SECRET=...
BCRYPT_ROUNDS=10
API_KEY=...
```

### Backup
- ✅ ทำ backup อัตโนมัติรายวัน
- ✅ เข้ารหัสไฟล์ backup
- ✅ ทดสอบ restore เป็นระยะ

## 4. Server / Infrastructure

### Updates
- ✅ อัปเดต OS, Database, Runtime เป็นประจำ
- ✅ ติดตาม security patches

### Firewall
- ✅ เปิดเฉพาะ port ที่จำเป็น (80, 443)
- ✅ Database ไม่ควรเปิดออก internet
- ✅ ใช้ Security Groups / Firewall rules

### Architecture
- ✅ แยก Web server กับ Database
- ✅ ใช้ Managed Database (RDS, Cloud SQL)
- ✅ ใช้ WAF และ DDoS protection

## 5. Logging & Monitoring

### Audit Logs
บันทึกทุกการกระทำสำคัญ:
- Login / Logout
- Login failed
- Password change
- Student create/update/delete
- Coaching session create/update/delete
- File upload/delete
- Permission/role change

### Log Format
```typescript
{
  id: string;
  userId: string;
  userRole: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}
```

### Monitoring
- ✅ ตั้ง Alert สำหรับ login ผิดพลาดเยอะ
- ✅ ตั้ง Alert สำหรับ request ผิดปกติ
- ✅ ตรวจสอบ Audit Logs เป็นประจำ

## 6. Privacy / นโยบายข้อมูล

### Data Collection
เก็บข้อมูลเท่าที่จำเป็น:
- ข้อมูลส่วนตัว (ชื่อ, อีเมล)
- ข้อมูลโปรเจกต์
- ข้อมูล Coaching Sessions
- ไฟล์แนบ

### User Rights
ผู้ใช้มีสิทธิ์:
- ✅ ดูข้อมูลของตัวเอง
- ✅ แก้ไขข้อมูลที่แก้ไขได้
- ✅ ลบข้อมูล (ภายใต้ข้อจำกัดทางกฎหมาย)
- ✅ ส่งออกข้อมูล

### Privacy Policy
- ✅ มีหน้า Privacy Policy
- ✅ อธิบายว่าข้อมูลถูกใช้อย่างไร
- ✅ ใครบ้างที่เห็นข้อมูล

## Implementation Checklist

### Frontend (✅ Completed)
- [x] Password validation
- [x] Input sanitization
- [x] File upload validation
- [x] CSRF token generation
- [x] Rate limiting helper
- [x] Audit logging utilities
- [x] Protected routes
- [x] Privacy policy page
- [x] Secure login page

### Backend (⚠️ Required)
- [ ] Password hashing (bcrypt/Argon2)
- [ ] JWT token generation & validation
- [ ] Refresh token mechanism
- [ ] SQL injection prevention (Prepared Statements/ORM)
- [ ] CSRF token validation
- [ ] Rate limiting middleware
- [ ] File upload security (server-side)
- [ ] Audit log API
- [ ] HTTPS configuration
- [ ] Data encryption
- [ ] Backup system
- [ ] Monitoring & alerts

## Security Headers

```typescript
// Backend ต้องตั้ง security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## Testing

### Security Testing
- [ ] Penetration testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Authentication bypass testing
- [ ] Authorization testing

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

