export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface StudentUser extends User {
  role: 'student';
  studentId: string;
  stream: string;
  year: number;
  semester: number;
  phone: string;
}

export interface TeacherUser extends User {
  role: 'teacher';
  teacherId: string;
  subjects: string[];
  department: string;
}

export interface AdminUser extends User {
  role: 'admin';
  adminId: string;
  permissions: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  hoursPerWeek: number;
  teacher: string;
  department: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject?: Subject;
  teacher?: string;
  room?: string;
  isBreak?: boolean;
  isLunch?: boolean;
}

export interface Timetable {
  id: string;
  branch: string;
  semester: number;
  stream: string;
  periodsPerDay: number;
  lunchPeriod: number;
  timeSlots: TimeSlot[];
  createdAt: string;
  lastModified: string;
}

export interface FacultyRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  requestType: 'leave' | 'special_class';
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  affectedClasses?: string[];
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  pendingRequests: number;
  weeklyActivity: Array<{
    day: string;
    requests: number;
    classes: number;
  }>;
}

export interface TimetableFormData {
  branch: string;
  semester: number;
  stream: string;
  periodsPerDay: number;
  lunchPeriod: number;
  subjects: Subject[];
  freePeriods: number[];
}