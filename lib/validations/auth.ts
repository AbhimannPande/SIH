import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher', 'admin'])
});

export const studentRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  stream: z.string().min(1, 'Please select a stream'),
  year: z.number().min(1).max(4),
  semester: z.number().min(1).max(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const teacherRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const facultyRequestSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)'),
  requestType: z.enum(['leave', 'special_class'])
});

export const timetableFormSchema = z.object({
  branch: z.string().min(1, 'Please select a branch'),
  semester: z.number().min(1).max(8),
  stream: z.string().min(1, 'Please select a stream'),
  periodsPerDay: z.number().min(4).max(10),
  lunchPeriod: z.number().min(1),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;
export type TeacherRegisterFormData = z.infer<typeof teacherRegisterSchema>;
export type FacultyRequestFormData = z.infer<typeof facultyRequestSchema>;
export type TimetableFormData = z.infer<typeof timetableFormSchema>;