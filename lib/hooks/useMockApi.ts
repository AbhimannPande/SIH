'use client';

import { useState } from 'react';
import { 
  mockUsers, 
  mockDashboardStats, 
  mockFacultyRequests, 
  mockTimetables,
  mockSubjects,
  mockTeachers,
  mockExams
} from '@/data/mockData';
import { Role, DashboardStats, FacultyRequest, Timetable, Subject } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMockApi = () => {
  const [loading, setLoading] = useState(false);

  const getDashboardStats = async (role: Role): Promise<DashboardStats> => {
    setLoading(true);
    await delay(800);
    setLoading(false);
    return mockDashboardStats[role];
  };

  const getFacultyRequests = async (): Promise<FacultyRequest[]> => {
    setLoading(true);
    await delay(600);
    setLoading(false);
    return mockFacultyRequests;
  };

  const getTimetables = async (branch?: string, semester?: number): Promise<Timetable[]> => {
    setLoading(true);
    await delay(700);
    setLoading(false);
    
    let filtered = mockTimetables;
    if (branch) {
      filtered = filtered.filter(t => t.branch === branch);
    }
    if (semester) {
      filtered = filtered.filter(t => t.semester === semester);
    }
    
    return filtered;
  };

  const getSubjects = async (): Promise<Subject[]> => {
    setLoading(true);
    await delay(500);
    setLoading(false);
    return mockSubjects;
  };

  const getTeachers = async () => {
    setLoading(true);
    await delay(400);
    setLoading(false);
    return mockTeachers;
  };

  const getExams = async () => {
    setLoading(true);
    await delay(300);
    setLoading(false);
    return mockExams;
  };

  const login = async (email: string, password: string, role: Role) => {
    setLoading(true);
    await delay(1000);
    setLoading(false);
    
    // Simulate authentication
    if (password === 'password123') {
      return mockUsers[role];
    }
    throw new Error('Invalid credentials');
  };

  const register = async (userData: any, role: Role) => {
    setLoading(true);
    await delay(1200);
    setLoading(false);
    
    // Simulate registration
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      role,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return newUser;
  };

  const submitFacultyRequest = async (request: Omit<FacultyRequest, 'id' | 'status' | 'submittedAt'>) => {
    setLoading(true);
    await delay(800);
    setLoading(false);
    
    return {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
  };

  const generateTimetable = async (formData: any) => {
    setLoading(true);
    await delay(2000); // Simulate longer processing time
    setLoading(false);
    
    // Return multiple timetable options
    return [
      {
        id: '1',
        name: 'Option 1 - Balanced',
        description: 'Evenly distributed subjects with optimal break timing',
        ...mockTimetables[0]
      },
      {
        id: '2',
        name: 'Option 2 - Morning Heavy',
        description: 'More classes in morning, lighter afternoon schedule',
        ...mockTimetables[0]
      },
      {
        id: '3',
        name: 'Option 3 - Afternoon Focus',
        description: 'Concentrated afternoon sessions with morning preparation time',
        ...mockTimetables[0]
      }
    ];
  };

  const checkForClashes = async (timeSlot: any, currentTimetable: any) => {
    await delay(200);
    
    // Mock clash detection logic
    const hasClash = Math.random() > 0.8; // 20% chance of clash
    
    if (hasClash) {
      return {
        hasClash: true,
        clashType: 'teacher_conflict',
        message: 'Teacher has another class at this time'
      };
    }
    
    return { hasClash: false };
  };

  return {
    loading,
    getDashboardStats,
    getFacultyRequests,
    getTimetables,
    getSubjects,
    getTeachers,
    getExams,
    login,
    register,
    submitFacultyRequest,
    generateTimetable,
    checkForClashes
  };
};