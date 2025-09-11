'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Search,
  Filter,
  ChevronRight,
  MapPin
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useAuthStore } from '@/lib/stores/authStore';

const weeklySchedule = {
  Monday: [
    { time: '09:00-10:00', subject: 'Data Structures', teacher: 'Dr. Sarah Wilson', room: 'CS-101' },
    { time: '10:00-11:00', subject: 'Database Systems', teacher: 'Dr. John Smith', room: 'CS-102' },
    { time: '11:00-12:00', subject: 'Operating Systems', teacher: 'Dr. Emily Brown', room: 'CS-103' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: '', isBreak: true },
    { time: '13:00-14:00', subject: 'Software Engineering', teacher: 'Dr. Michael Davis', room: 'CS-104' },
  ],
  Tuesday: [
    { time: '09:00-10:00', subject: 'Database Systems', teacher: 'Dr. John Smith', room: 'CS-102' },
    { time: '10:00-11:00', subject: 'Data Structures Lab', teacher: 'Dr. Sarah Wilson', room: 'Lab-1' },
    { time: '11:00-12:00', subject: 'Computer Networks', teacher: 'Dr. Lisa Anderson', room: 'CS-105' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: '', isBreak: true },
    { time: '13:00-14:00', subject: 'OS Lab', teacher: 'Dr. Emily Brown', room: 'Lab-2' },
  ],
  Wednesday: [
    { time: '09:00-10:00', subject: 'Software Engineering', teacher: 'Dr. Michael Davis', room: 'CS-104' },
    { time: '10:00-11:00', subject: 'Data Structures', teacher: 'Dr. Sarah Wilson', room: 'CS-101' },
    { time: '11:00-12:00', subject: 'Database Systems', teacher: 'Dr. John Smith', room: 'CS-102' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: '', isBreak: true },
    { time: '13:00-14:00', subject: 'Computer Networks', teacher: 'Dr. Lisa Anderson', room: 'CS-105' },
  ],
  Thursday: [
    { time: '09:00-10:00', subject: 'Operating Systems', teacher: 'Dr. Emily Brown', room: 'CS-103' },
    { time: '10:00-11:00', subject: 'Software Engineering', teacher: 'Dr. Michael Davis', room: 'CS-104' },
    { time: '11:00-12:00', subject: 'Database Lab', teacher: 'Dr. John Smith', room: 'Lab-3' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: '', isBreak: true },
    { time: '13:00-14:00', subject: 'Computer Networks Lab', teacher: 'Dr. Lisa Anderson', room: 'Lab-4' },
  ],
  Friday: [
    { time: '09:00-10:00', subject: 'Data Structures', teacher: 'Dr. Sarah Wilson', room: 'CS-101' },
    { time: '10:00-11:00', subject: 'Operating Systems', teacher: 'Dr. Emily Brown', room: 'CS-103' },
    { time: '11:00-12:00', subject: 'Software Engineering Project', teacher: 'Dr. Michael Davis', room: 'CS-104' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: '', isBreak: true },
  ],
};

const todayClasses = weeklySchedule.Monday; // Assuming today is Monday

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { getDashboardStats, getTeachers, getExams, loading } = useMockApi();
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, teachersData, examsData] = await Promise.all([
          getDashboardStats('student'),
          getTeachers(),
          getExams()
        ]);
        setStats(statsData);
        setTeachers(teachersData);
        setExams(examsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    loadData();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading || !stats) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Computer Science • Semester 5 • Regular
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✓ Attendance: 92%
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Next: Data Structures at 9:00 AM
            </Badge>
          </div>
        </motion.div>

        {/* Today's Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {todayClasses.map((class_item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                      class_item.isBreak 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200' 
                        : 'bg-white dark:bg-gray-800 border-blue-200 hover:shadow-md hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        class_item.isBreak ? 'bg-gray-300' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className={`font-medium ${
                          class_item.isBreak ? 'text-gray-500' : 'text-gray-900 dark:text-white'
                        }`}>
                          {class_item.subject}
                        </p>
                        <p className="text-sm text-gray-500">
                          {class_item.time} {class_item.teacher && `• ${class_item.teacher}`}
                        </p>
                      </div>
                    </div>
                    {!class_item.isBreak && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{class_item.room}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="timetable" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timetable">Full Timetable</TabsTrigger>
              <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
              <TabsTrigger value="faculty">Find Faculty</TabsTrigger>
            </TabsList>

            {/* Full Timetable */}
            <TabsContent value="timetable" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Weekly Schedule</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {Object.keys(weeklySchedule).map((day) => (
                        <Button
                          key={day}
                          variant={selectedDay === day ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDay(day)}
                          className="min-w-fit"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>

                    <div className="grid gap-3">
                      {weeklySchedule[selectedDay].map((class_item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            class_item.isBreak 
                              ? 'bg-gray-50 dark:bg-gray-800 border-gray-200' 
                              : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-lg font-mono text-gray-600">
                                {class_item.time}
                              </div>
                              <div>
                                <p className={`font-semibold ${
                                  class_item.isBreak ? 'text-gray-500' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {class_item.subject}
                                </p>
                                {!class_item.isBreak && (
                                  <p className="text-sm text-gray-600">
                                    {class_item.teacher} • {class_item.room}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exam Schedule */}
            <TabsContent value="exams" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Examinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {exams.map((exam, index) => (
                      <AccordionItem key={exam.id} value={`exam-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="text-left">
                              <p className="font-semibold">{exam.subject}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(exam.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <Badge variant="outline">{exam.time}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Duration</p>
                                <p className="font-semibold">{exam.duration}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Venue</p>
                                <p className="font-semibold">{exam.room}</p>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                ℹ️ Bring your student ID card and stationery. Electronic devices are not allowed.
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Faculty Directory */}
            <TabsContent value="faculty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search by name, department, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid gap-4">
                      {filteredTeachers.map((teacher, index) => (
                        <motion.div
                          key={teacher.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {teacher.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {teacher.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {teacher.department}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {teacher.subjects.slice(0, 2).map((subject, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                  {teacher.subjects.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{teacher.subjects.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={teacher.availability === 'Available' ? 'default' : 'secondary'}
                                className={teacher.availability === 'Available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                                }
                              >
                                {teacher.availability}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}