import { User, Project, CoachingSession, LearningRecord, Portfolio, Evaluation } from '../types';

export const mockUsers: User[] = [
  {
    id: 's1',
    name: 'สมชาย ใจดี',
    email: 'somchai@student.spu.ac.th',
    role: 'student',
  },
  {
    id: 's2',
    name: 'สมหญิง รักเรียน',
    email: 'somying@student.spu.ac.th',
    role: 'student',
  },
  {
    id: 's3',
    name: 'ประยุทธ์ พัฒนา',
    email: 'prayuth@student.spu.ac.th',
    role: 'student',
  },
  {
    id: 'a1',
    name: 'อ.ดร.วิชัย สอนดี',
    email: 'wichai@spu.ac.th',
    role: 'advisor',
  },
  {
    id: 'a2',
    name: 'อ.ดร.สุดา แนะนำ',
    email: 'suda@spu.ac.th',
    role: 'advisor',
  },
  {
    id: 'admin1',
    name: 'ผศ.ดร.บริหาร จัดการ',
    email: 'admin@spu.ac.th',
    role: 'admin',
  },
  {
    id: 'c1',
    name: 'ดร.นอก ประเมิน',
    email: 'external@company.com',
    role: 'committee',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'E-Learning Platform for SPU',
    description: 'ระบบการเรียนการสอนออนไลน์แบบ Interactive พร้อมฟีเจอร์ AI Tutor',
    teamMembers: ['s1', 's2'],
    advisorId: 'a1',
    status: 'implementation',
    progress: 65,
    startDate: '2024-08-01',
    endDate: '2025-04-30',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'OpenAI API'],
  },
  {
    id: 'p2',
    name: 'Smart Campus IoT System',
    description: 'ระบบจัดการอาคารอัจฉริยะด้วย IoT Sensors',
    teamMembers: ['s3'],
    advisorId: 'a1',
    status: 'design',
    progress: 40,
    startDate: '2024-08-01',
    endDate: '2025-04-30',
    techStack: ['React', 'MQTT', 'MongoDB', 'Arduino'],
  },
  {
    id: 'p3',
    name: 'Healthcare Appointment System',
    description: 'ระบบนัดหมายแพทย์และติดตามประวัติผู้ป่วย',
    teamMembers: ['s1'],
    advisorId: 'a2',
    status: 'testing',
    progress: 85,
    startDate: '2024-08-01',
    endDate: '2025-04-30',
    techStack: ['Vue.js', 'Laravel', 'MySQL'],
  },
];

export const mockCoachingSessions: CoachingSession[] = [
  {
    id: 'cs1',
    projectId: 'p1',
    studentIds: ['s1', 's2'],
    advisorId: 'a1',
    date: '2024-11-20T14:00:00',
    duration: 60,
    topics: ['Progress Review', 'Technical Issues', 'Next Sprint Planning'],
    summary: 'ทีมได้ทำ User Authentication และ Dashboard สำเร็จแล้ว กำลังมีปัญหาเรื่อง API Integration กับ OpenAI',
    actionItems: [
      {
        id: 'ai1',
        description: 'แก้ไขปัญหา OpenAI API Rate Limiting',
        assignedTo: 's1',
        dueDate: '2024-11-27',
        status: 'in-progress',
        priority: 'high',
      },
      {
        id: 'ai2',
        description: 'ทำ Unit Tests สำหรับ Authentication Module',
        assignedTo: 's2',
        dueDate: '2024-11-25',
        status: 'completed',
        priority: 'medium',
      },
      {
        id: 'ai3',
        description: 'เตรียมเอกสาร System Design สำหรับ Mid-term Review',
        assignedTo: 's1',
        dueDate: '2024-11-30',
        status: 'pending',
        priority: 'high',
      },
    ],
    evidenceFiles: [
      {
        id: 'e1',
        fileName: 'sprint-2-demo.mp4',
        fileUrl: '#',
        fileType: 'video',
        uploadedBy: 's1',
        uploadedAt: '2024-11-20T13:30:00',
        description: 'Demo การทำงานของ Authentication System',
      },
      {
        id: 'e2',
        fileName: 'api-integration-diagram.pdf',
        fileUrl: '#',
        fileType: 'pdf',
        uploadedBy: 's2',
        uploadedAt: '2024-11-20T13:45:00',
      },
    ],
    notes: 'ทีมมีความก้าวหน้าดีมาก แต่ควรเร่งแก้ปัญหา API เพื่อไม่ให้กระทบ Timeline',
    nextSessionDate: '2024-11-27T14:00:00',
  },
  {
    id: 'cs2',
    projectId: 'p1',
    studentIds: ['s1', 's2'],
    advisorId: 'a1',
    date: '2024-11-13T14:00:00',
    duration: 45,
    topics: ['Sprint 2 Planning', 'Database Schema Review'],
    summary: 'วางแผน Sprint 2 และ Review Database Schema ทีมเข้าใจโครงสร้างดีแล้ว',
    actionItems: [
      {
        id: 'ai4',
        description: 'Implement User Registration API',
        assignedTo: 's1',
        dueDate: '2024-11-18',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 'ai5',
        description: 'Design Dashboard UI Mockup',
        assignedTo: 's2',
        dueDate: '2024-11-17',
        status: 'completed',
        priority: 'medium',
      },
    ],
    evidenceFiles: [],
    notes: 'ทีมพร้อมที่จะเริ่ม Sprint 2',
  },
  {
    id: 'cs3',
    projectId: 'p2',
    studentIds: ['s3'],
    advisorId: 'a1',
    date: '2024-11-18T10:00:00',
    duration: 60,
    topics: ['IoT Architecture Design', 'Sensor Selection'],
    summary: 'หารือเรื่องการเลือก Sensors และการออกแบบ System Architecture',
    actionItems: [
      {
        id: 'ai6',
        description: 'Research และเลือก Temperature & Humidity Sensors',
        assignedTo: 's3',
        dueDate: '2024-11-25',
        status: 'in-progress',
        priority: 'high',
      },
      {
        id: 'ai7',
        description: 'วาด System Architecture Diagram',
        assignedTo: 's3',
        dueDate: '2024-11-28',
        status: 'pending',
        priority: 'medium',
      },
    ],
    evidenceFiles: [
      {
        id: 'e3',
        fileName: 'sensor-comparison.xlsx',
        fileUrl: '#',
        fileType: 'excel',
        uploadedBy: 's3',
        uploadedAt: '2024-11-18T09:30:00',
      },
    ],
    notes: 'นักศึกษาต้องการคำแนะนำเพิ่มเติมเรื่อง MQTT Protocol',
    nextSessionDate: '2024-11-25T10:00:00',
  },
];

export const mockLearningRecords: LearningRecord[] = [
  {
    id: 'lr1',
    studentId: 's1',
    projectId: 'p1',
    skills: ['React', 'API Integration', 'Authentication', 'Team Collaboration'],
    achievements: [
      'สร้าง User Authentication System สำเร็จ',
      'Integrate OpenAI API เข้ากับระบบ',
      'นำเสนอ Demo ต่อหน้าอาจารย์และเพื่อนๆ',
    ],
    reflections: 'ได้เรียนรู้การทำงานร่วมกับทีมและการแก้ปัญหาเชิงเทคนิค โดยเฉพาะเรื่อง API Rate Limiting ซึ่งต้องศึกษาและหาวิธีแก้ไขด้วยตนเอง',
    createdAt: '2024-11-20',
  },
];

export const mockPortfolios: Portfolio[] = [
  {
    id: 'pf1',
    studentId: 's1',
    projects: [
      {
        projectId: 'p1',
        title: 'E-Learning Platform with AI Tutor',
        description: 'Interactive online learning platform with AI-powered tutoring system',
        role: 'Full-stack Developer & Team Lead',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'OpenAI API'],
        highlights: [
          'Implemented secure authentication system',
          'Integrated AI tutoring features using OpenAI API',
          'Led team of 2 developers',
        ],
        demoUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/example',
        images: [],
      },
    ],
    skills: ['React', 'Node.js', 'PostgreSQL', 'API Integration', 'Team Leadership', 'Agile/Scrum'],
    bio: 'นักศึกษาวิศวกรรมซอฟต์แวร์ ชั้นปีที่ 4 มีความสนใจด้าน Full-stack Development และ AI Integration',
    resumeUrl: '#',
  },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: 'ev1',
    projectId: 'p3',
    committeeId: 'c1',
    scores: [
      { category: 'Technical Implementation', score: 42, maxScore: 50 },
      { category: 'Innovation & Creativity', score: 18, maxScore: 20 },
      { category: 'Project Management', score: 14, maxScore: 15 },
      { category: 'Presentation', score: 13, maxScore: 15 },
    ],
    comments: 'โปรเจกต์มีความสมบูรณ์สูง มีการนำเทคโนโลยีมาใช้อย่างเหมาะสม แต่ควรปรับปรุง UI/UX ให้ใช้งานง่ายขึ้น',
    strengths: [
      'Technical implementation แข็งแกร่ง',
      'Database design ดีมาก',
      'มี Test coverage สูง',
    ],
    improvements: [
      'UI/UX ควรปรับให้ User-friendly มากขึ้น',
      'Documentation ควรเพิ่มรายละเอียด',
    ],
    createdAt: '2024-11-15',
  },
];
