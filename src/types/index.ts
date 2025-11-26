export type UserRole = 'student' | 'advisor' | 'admin' | 'committee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  teamMembers: string[];
  advisorId: string;
  status: 'proposal' | 'design' | 'implementation' | 'testing' | 'presentation' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  techStack: string[];
}

export interface CoachingSession {
  id: string;
  projectId: string;
  studentIds: string[];
  advisorId: string;
  date: string;
  duration: number;
  topics: string[];
  summary: string;
  actionItems: ActionItem[];
  evidenceFiles: Evidence[];
  notes: string;
  nextSessionDate?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Evidence {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
}

export interface LearningRecord {
  id: string;
  studentId: string;
  projectId: string;
  skills: string[];
  achievements: string[];
  reflections: string;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  studentId: string;
  projects: PortfolioProject[];
  skills: string[];
  bio: string;
  resumeUrl?: string;
}

export interface PortfolioProject {
  projectId: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  highlights: string[];
  demoUrl?: string;
  githubUrl?: string;
  images: string[];
}

export interface Evaluation {
  id: string;
  projectId: string;
  committeeId: string;
  scores: {
    category: string;
    score: number;
    maxScore: number;
  }[];
  comments: string;
  strengths: string[];
  improvements: string[];
  createdAt: string;
}
