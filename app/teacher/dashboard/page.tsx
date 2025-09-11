'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  FileText,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useAuthStore } from '@/lib/stores/authStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { facultyRequestSchema, FacultyRequestFormData } from '@/lib/validations/auth';

const todaySchedule = [
  { time: '09:00 - 10:00', subject: 'Data Structures', room: 'CS-101', students: 45 },
  { time: '10:00 - 11:00', subject: 'Database Systems', room: 'CS-102', students: 38 },
  { time: '11:00 - 12:00', subject: 'Break', room: '', students: 0, isBreak: true },
  { time: '12:00 - 13:00', subject: 'Data Structures Lab', room: 'Lab-1', students: 25 },
  { time: '14:00 - 15:00', subject: 'Database Systems', room: 'CS-102', students: 40 }
];

const workloadData = [
  { name: 'Data Structures', value: 40, color: '#3B82F6' },
  { name: 'Database Systems', value: 35, color: '#10B981' },
  { name: 'Research', value: 15, color: '#F59E0B' },
  { name: 'Admin Work', value: 10, color: '#EF4444' }
];

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const { getDashboardStats, submitFacultyRequest, loading } = useMockApi();
  const [stats, setStats] = useState(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FacultyRequestFormData>({
    resolver: zodResolver(facultyRequestSchema)
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats('teacher');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

  const onSubmitRequest = async (data: FacultyRequestFormData) => {
    try {
      await submitFacultyRequest({
        teacherId: user?.id || '',
        teacherName: user?.name || '',
        ...data
      });
      
      addNotification({
        title: 'Request Submitted',
        message: 'Your request has been submitted successfully and is pending approval.',
        type: 'success'
      });
      
      setIsRequestDialogOpen(false);
      reset();
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to submit request. Please try again.',
        type: 'error'
      });
    }
  };

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
              Good morning, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You have 5 classes scheduled for today
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit Faculty Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type</Label>
                    <Select onValueChange={(value) => setValue('requestType', value as 'leave' | 'special_class')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leave">Leave Request</SelectItem>
                        <SelectItem value="special_class">Special Class Request</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.requestType && (
                      <p className="text-sm text-red-500">{errors.requestType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      {...register('date')}
                      type="date"
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      {...register('reason')}
                      placeholder="Please provide detailed reason for your request..."
                      rows={4}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-500">{errors.reason.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Classes Today',
              value: '5',
              change: 'Next: 9:00 AM',
              icon: Calendar,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Total Students',
              value: stats.totalStudents.toString(),
              change: 'Across all classes',
              icon: Users,
              color: 'text-green-600',
              bgColor: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Subjects Teaching',
              value: stats.totalSubjects.toString(),
              change: 'This semester',
              icon: BookOpen,
              color: 'text-purple-600',
              bgColor: 'bg-purple-100 dark:bg-purple-900/20'
            },
            {
              title: 'Pending Requests',
              value: stats.pendingRequests.toString(),
              change: 'Awaiting approval',
              icon: FileText,
              color: 'text-orange-600',
              bgColor: 'bg-orange-100 dark:bg-orange-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((class_item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        class_item.isBreak 
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                          : 'bg-white dark:bg-gray-800 border-blue-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          class_item.isBreak ? 'bg-gray-300' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            class_item.isBreak ? 'text-gray-500' : 'text-gray-900 dark:text-white'
                          }`}>
                            {class_item.subject}
                          </p>
                          <p className="text-sm text-gray-500">
                            {class_item.time} {class_item.room && `• ${class_item.room}`}
                          </p>
                        </div>
                      </div>
                      {!class_item.isBreak && (
                        <Badge variant="secondary">
                          {class_item.students} students
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workload Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workloadData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workloadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Performance & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="classes" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      name="Classes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Class completed: Data Structures',
                      time: '1 hour ago',
                      status: 'success',
                      icon: CheckCircle
                    },
                    {
                      action: 'Leave request submitted for Feb 15',
                      time: '2 hours ago',
                      status: 'pending',
                      icon: AlertCircle
                    },
                    {
                      action: 'Graded assignments for Database Systems',
                      time: '1 day ago',
                      status: 'success',
                      icon: BookOpen
                    },
                    {
                      action: 'Updated course materials',
                      time: '2 days ago',
                      status: 'success',
                      icon: FileText
                    }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                          : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20'
                      }`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}