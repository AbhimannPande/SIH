import { Subject, TimeSlot, Timetable, FacultyRequest, DashboardStats, StudentUser, TeacherUser, AdminUser } from '@/types';

export const mockUsers = {
  student: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@student.edu',
    role: 'student' as const,
    studentId: 'STU2024001',
    stream: 'Computer Science',
    year: 3,
    semester: 5,
    phone: '+1-555-0123',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
  } as StudentUser,
  
  teacher: {
    id: '2',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@college.edu',
    role: 'teacher' as const,
    teacherId: 'TCH2024001',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  } as TeacherUser,
  
  admin: {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@college.edu',
    role: 'admin' as const,
    adminId: 'ADM2024001',
    permissions: ['manage_timetables', 'manage_faculty', 'manage_students'],
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400'
  } as AdminUser
};

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures',
    code: 'CS301',
    credits: 3,
    hoursPerWeek: 4,
    teacher: 'Dr. Sarah Wilson',
    department: 'Computer Science'
  },
  {
    id: '2',
    name: 'Database Systems',
    code: 'CS302',
    credits: 3,
    hoursPerWeek: 4,
    teacher: 'Dr. John Smith',
    department: 'Computer Science'
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'CS303',
    credits: 3,
    hoursPerWeek: 4,
    teacher: 'Dr. Emily Brown',
    department: 'Computer Science'
  },
  {
    id: '4',
    name: 'Software Engineering',
    code: 'CS304',
    credits: 3,
    hoursPerWeek: 3,
    teacher: 'Dr. Michael Davis',
    department: 'Computer Science'
  },
  {
    id: '5',
    name: 'Computer Networks',
    code: 'CS305',
    credits: 3,
    hoursPerWeek: 3,
    teacher: 'Dr. Lisa Anderson',
    department: 'Computer Science'
  }
];

export const mockTimeSlots: TimeSlot[] = [
  // Monday
  { id: '1', day: 'Monday', period: 1, startTime: '09:00', endTime: '10:00', subject: mockSubjects[0], teacher: 'Dr. Sarah Wilson', room: 'CS-101' },
  { id: '2', day: 'Monday', period: 2, startTime: '10:00', endTime: '11:00', subject: mockSubjects[1], teacher: 'Dr. John Smith', room: 'CS-102' },
  { id: '3', day: 'Monday', period: 3, startTime: '11:00', endTime: '12:00', subject: mockSubjects[2], teacher: 'Dr. Emily Brown', room: 'CS-103' },
  { id: '4', day: 'Monday', period: 4, startTime: '12:00', endTime: '13:00', isLunch: true },
  { id: '5', day: 'Monday', period: 5, startTime: '13:00', endTime: '14:00', subject: mockSubjects[3], teacher: 'Dr. Michael Davis', room: 'CS-104' },
  { id: '6', day: 'Monday', period: 6, startTime: '14:00', endTime: '15:00', subject: mockSubjects[4], teacher: 'Dr. Lisa Anderson', room: 'CS-105' },
  
  // Tuesday
  { id: '7', day: 'Tuesday', period: 1, startTime: '09:00', endTime: '10:00', subject: mockSubjects[1], teacher: 'Dr. John Smith', room: 'CS-102' },
  { id: '8', day: 'Tuesday', period: 2, startTime: '10:00', endTime: '11:00', subject: mockSubjects[0], teacher: 'Dr. Sarah Wilson', room: 'CS-101' },
  { id: '9', day: 'Tuesday', period: 3, startTime: '11:00', endTime: '12:00', subject: mockSubjects[3], teacher: 'Dr. Michael Davis', room: 'CS-104' },
  { id: '10', day: 'Tuesday', period: 4, startTime: '12:00', endTime: '13:00', isLunch: true },
  { id: '11', day: 'Tuesday', period: 5, startTime: '13:00', endTime: '14:00', subject: mockSubjects[2], teacher: 'Dr. Emily Brown', room: 'CS-103' },
  { id: '12', day: 'Tuesday', period: 6, startTime: '14:00', endTime: '15:00', subject: mockSubjects[4], teacher: 'Dr. Lisa Anderson', room: 'CS-105' },
];

export const mockTimetables: Timetable[] = [
  {
    id: '1',
    branch: 'Computer Science',
    semester: 5,
    stream: 'Regular',
    periodsPerDay: 6,
    lunchPeriod: 4,
    timeSlots: mockTimeSlots,
    createdAt: '2024-01-15',
    lastModified: '2024-01-20'
  }
];

export const mockFacultyRequests: FacultyRequest[] = [
  {
    id: '1',
    teacherId: 'TCH2024001',
    teacherName: 'Dr. Sarah Wilson',
    requestType: 'leave',
    date: '2024-02-15',
    reason: 'Medical appointment',
    status: 'pending',
    submittedAt: '2024-02-10',
    affectedClasses: ['CS301 - Data Structures', 'CS302 - Database Systems']
  },
  {
    id: '2',
    teacherId: 'TCH2024002',
    teacherName: 'Dr. John Smith',
    requestType: 'special_class',
    date: '2024-02-18',
    reason: 'Make-up class for missed lecture',
    status: 'approved',
    submittedAt: '2024-02-12'
  },
  {
    id: '3',
    teacherId: 'TCH2024003',
    teacherName: 'Dr. Emily Brown',
    requestType: 'leave',
    date: '2024-02-20',
    reason: 'Conference attendance',
    status: 'pending',
    submittedAt: '2024-02-14',
    affectedClasses: ['CS303 - Operating Systems']
  }
];

export const mockDashboardStats: Record<string, DashboardStats> = {
  admin: {
    totalStudents: 1250,
    totalTeachers: 85,
    totalSubjects: 120,
    pendingRequests: 12,
    weeklyActivity: [
      { day: 'Mon', requests: 5, classes: 45 },
      { day: 'Tue', requests: 8, classes: 42 },
      { day: 'Wed', requests: 3, classes: 48 },
      { day: 'Thu', requests: 12, classes: 40 },
      { day: 'Fri', requests: 7, classes: 38 },
      { day: 'Sat', requests: 2, classes: 25 },
      { day: 'Sun', requests: 1, classes: 15 }
    ]
  },
  teacher: {
    totalStudents: 180,
    totalTeachers: 1,
    totalSubjects: 3,
    pendingRequests: 1,
    weeklyActivity: [
      { day: 'Mon', requests: 0, classes: 6 },
      { day: 'Tue', requests: 1, classes: 5 },
      { day: 'Wed', requests: 0, classes: 7 },
      { day: 'Thu', requests: 0, classes: 6 },
      { day: 'Fri', requests: 0, classes: 4 },
      { day: 'Sat', requests: 0, classes: 2 },
      { day: 'Sun', requests: 0, classes: 0 }
    ]
  },
  student: {
    totalStudents: 1,
    totalTeachers: 15,
    totalSubjects: 8,
    pendingRequests: 0,
    weeklyActivity: [
      { day: 'Mon', requests: 0, classes: 6 },
      { day: 'Tue', requests: 0, classes: 5 },
      { day: 'Wed', requests: 0, classes: 7 },
      { day: 'Thu', requests: 0, classes: 6 },
      { day: 'Fri', requests: 0, classes: 4 },
      { day: 'Sat', requests: 0, classes: 2 },
      { day: 'Sun', requests: 0, classes: 0 }
    ]
  }
};

export const mockTeachers = [
  { id: '1', name: 'Dr. Sarah Wilson', department: 'Computer Science', subjects: ['Data Structures', 'Algorithms'], availability: 'Available' },
  { id: '2', name: 'Dr. John Smith', department: 'Computer Science', subjects: ['Database Systems', 'Web Development'], availability: 'Busy' },
  { id: '3', name: 'Dr. Emily Brown', department: 'Computer Science', subjects: ['Operating Systems', 'System Programming'], availability: 'Available' },
  { id: '4', name: 'Dr. Michael Davis', department: 'Computer Science', subjects: ['Software Engineering', 'Project Management'], availability: 'Available' },
  { id: '5', name: 'Dr. Lisa Anderson', department: 'Computer Science', subjects: ['Computer Networks', 'Cybersecurity'], availability: 'Office Hours' }
];

export const mockExams = [
  { id: '1', subject: 'Data Structures', date: '2024-03-15', time: '09:00 AM', duration: '3 hours', room: 'Main Hall' },
  { id: '2', subject: 'Database Systems', date: '2024-03-18', time: '02:00 PM', duration: '3 hours', room: 'CS Building' },
  { id: '3', subject: 'Operating Systems', date: '2024-03-20', time: '09:00 AM', duration: '3 hours', room: 'Main Hall' },
  { id: '4', subject: 'Software Engineering', date: '2024-03-22', time: '02:00 PM', duration: '3 hours', room: 'Lab 1' },
  { id: '5', subject: 'Computer Networks', date: '2024-03-25', time: '09:00 AM', duration: '3 hours', room: 'CS Building' }
];