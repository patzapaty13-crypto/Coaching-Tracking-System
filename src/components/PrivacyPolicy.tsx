import { Shield, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-gray-600">SPU Coaching Platform</p>
          <p className="text-sm text-gray-500 mt-2">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1: ข้อมูลที่เรารวบรวม */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. ข้อมูลที่เรารวบรวม</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>ระบบ SPU Coaching Platform รวบรวมข้อมูลต่อไปนี้:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>ข้อมูลส่วนตัว:</strong> ชื่อ, อีเมล, รหัสนักศึกษา/อาจารย์</li>
                <li><strong>ข้อมูลโปรเจกต์:</strong> ชื่อโปรเจกต์, คำอธิบาย, สถานะ, ความคืบหน้า</li>
                <li><strong>ข้อมูล Coaching Session:</strong> วันที่, หัวข้อ, สรุป, Action Items</li>
                <li><strong>ไฟล์แนบ:</strong> เอกสาร, รูปภาพ, วิดีโอที่อัปโหลด</li>
                <li><strong>ข้อมูลการประเมิน:</strong> คะแนน, ความคิดเห็น, ข้อเสนอแนะ</li>
                <li><strong>ข้อมูลการใช้งาน:</strong> Log การเข้าสู่ระบบ, การแก้ไขข้อมูล</li>
              </ul>
            </div>
          </section>

          {/* Section 2: วัตถุประสงค์ในการใช้ข้อมูล */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>เราใช้ข้อมูลที่รวบรวมเพื่อ:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ให้บริการระบบ Coaching และ Portfolio Management</li>
                <li>ติดตามความคืบหน้าของโปรเจกต์</li>
                <li>ประเมินผลการเรียนการสอน</li>
                <li>ปรับปรุงและพัฒนาระบบ</li>
                <li>ปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง</li>
              </ul>
            </div>
          </section>

          {/* Section 3: ใครบ้างที่เห็นข้อมูล */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. ใครบ้างที่เห็นข้อมูล</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>ข้อมูลของคุณจะถูกเข้าถึงตามสิทธิ์การใช้งาน:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>นักศึกษา:</strong> เห็นเฉพาะข้อมูลของตัวเองและโปรเจกต์ที่เกี่ยวข้อง</li>
                <li><strong>อาจารย์ที่ปรึกษา:</strong> เห็นข้อมูลของนักศึกษาที่อยู่ในความดูแล</li>
                <li><strong>ผู้บริหาร:</strong> เห็นข้อมูลทั้งหมดในระบบ</li>
                <li><strong>กรรมการภายนอก:</strong> เห็นเฉพาะโปรเจกต์ที่ได้รับมอบหมายให้ประเมิน</li>
                <li><strong>ผู้ดูแลระบบ:</strong> เข้าถึงข้อมูลทั้งหมดเพื่อการบำรุงรักษาและแก้ไขปัญหา</li>
              </ul>
            </div>
          </section>

          {/* Section 4: การปกป้องข้อมูล */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. การปกป้องข้อมูล</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>เราใช้มาตรการความปลอดภัยหลายชั้นเพื่อปกป้องข้อมูลของคุณ:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>การเข้ารหัส:</strong> ข้อมูลถูกส่งผ่าน HTTPS และรหัสผ่านถูกเข้ารหัสด้วย bcrypt/Argon2</li>
                <li><strong>การควบคุมการเข้าถึง:</strong> ใช้ Role-based Access Control (RBAC) เพื่อจำกัดสิทธิ์การเข้าถึง</li>
                <li><strong>การตรวจสอบ:</strong> บันทึก Audit Log ทุกการกระทำสำคัญ</li>
                <li><strong>การสำรองข้อมูล:</strong> ทำ backup ข้อมูลเป็นประจำและเข้ารหัสไฟล์ backup</li>
                <li><strong>การอัปเดตความปลอดภัย:</strong> อัปเดตระบบและแพตช์ความปลอดภัยเป็นประจำ</li>
              </ul>
            </div>
          </section>

          {/* Section 5: สิทธิ์ของคุณ */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. สิทธิ์ของคุณ</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>คุณมีสิทธิ์:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>ดูข้อมูล:</strong> ขอดูข้อมูลส่วนตัวของคุณได้ตลอดเวลา</li>
                <li><strong>แก้ไขข้อมูล:</strong> แก้ไขข้อมูลส่วนตัวที่สามารถแก้ไขได้</li>
                <li><strong>ลบข้อมูล:</strong> ขอลบข้อมูลส่วนตัวของคุณ (ภายใต้ข้อจำกัดทางกฎหมาย)</li>
                <li><strong>ส่งออกข้อมูล:</strong> ขอรับสำเนาข้อมูลของคุณในรูปแบบที่อ่านได้</li>
                <li><strong>ยกเลิกการยินยอม:</strong> ยกเลิกการยินยอมให้ใช้ข้อมูลได้ (อาจส่งผลต่อการใช้งานระบบ)</li>
              </ul>
            </div>
          </section>

          {/* Section 6: การเก็บรักษาข้อมูล */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. การเก็บรักษาข้อมูล</h2>
            <div className="space-y-4 text-gray-700">
              <p>เราจะเก็บรักษาข้อมูลของคุณ:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ตลอดระยะเวลาที่คุณใช้งานระบบ</li>
                <li>ตามระยะเวลาที่กฎหมายกำหนด (เช่น ข้อมูลการเรียนการสอน)</li>
                <li>จนกว่าคุณจะขอให้ลบข้อมูล (ภายใต้ข้อจำกัดทางกฎหมาย)</li>
              </ul>
            </div>
          </section>

          {/* Section 7: การแชร์ข้อมูลกับบุคคลที่สาม */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. การแชร์ข้อมูลกับบุคคลที่สาม</h2>
            <div className="space-y-4 text-gray-700">
              <p>เราไม่ขายหรือให้เช่าข้อมูลของคุณกับบุคคลที่สาม ข้อมูลจะถูกแชร์เฉพาะ:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ภายในมหาวิทยาลัย SPU ตามความจำเป็นในการให้บริการ</li>
                <li>เมื่อกฎหมายกำหนดให้ต้องเปิดเผย</li>
                <li>เมื่อได้รับความยินยอมจากคุณ</li>
              </ul>
            </div>
          </section>

          {/* Section 8: การเปลี่ยนแปลงนโยบาย */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. การเปลี่ยนแปลงนโยบาย</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว 
                การเปลี่ยนแปลงจะถูกประกาศบนหน้านี้และอัปเดตวันที่ "อัปเดตล่าสุด" 
                เราขอแนะนำให้คุณตรวจสอบหน้านี้เป็นประจำ
              </p>
            </div>
          </section>

          {/* Section 9: ติดต่อเรา */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. ติดต่อเรา</h2>
            <div className="space-y-4 text-gray-700">
              <p>หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อ:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> privacy@spu.ac.th</p>
                <p><strong>โทรศัพท์:</strong> 02-xxx-xxxx</p>
                <p><strong>ที่อยู่:</strong> มหาวิทยาลัยศรีปทุม</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              โดยการใช้งานระบบนี้ คุณยอมรับนโยบายความเป็นส่วนตัวนี้
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

