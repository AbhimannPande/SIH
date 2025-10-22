'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';
import { useMockApi } from '@/lib/hooks/useMockApi';
import { useAuthStore } from '@/lib/stores/authStore';

const quickActions = [
  {
    title: 'Generate Timetable',
    description: 'Create new class schedules with AI assistance',
    icon: Calendar,
    href: '/admin/timetable/generate',
    color: 'from-blue-500 to-blue-600',
    urgent: false
  },
  {
    title: 'Faculty Requests',
    description: '12 pending requests require attention',
    icon: FileText,
    href: '/admin/requests',
    color: 'from-orange-500 to-orange-600',
    urgent: true,
    badge: '12'
  },
  {
    title: 'Manage Faculty',
    description: 'Add, edit, or remove faculty members',
    icon: Users,
    href: '/admin/faculty',
    color: 'from-green-500 to-green-600',
    urgent: false
  },
  {
    title: 'Subject Management',
    description: 'Configure subjects and curriculum',
    icon: BookOpen,
    href: '/admin/subjects',
    color: 'from-purple-500 to-purple-600',
    urgent: false
  }
];

const pieData = [
  { name: 'Computer Science', value: 35, color: '#3B82F6' },
  { name: 'Information Technology', value: 28, color: '#10B981' },
  { name: 'Electronics', value: 20, color: '#F59E0B' },
  { name: 'Mechanical', value: 17, color: '#EF4444' }
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { getDashboardStats, loading } = useMockApi();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats('admin');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

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
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening in your institution today
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Students',
              value: stats.totalStudents.toLocaleString(),
              change: '+12%',
              trend: 'up',
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Faculty Members',
              value: stats.totalTeachers.toString(),
              change: '+3%',
              trend: 'up',
              icon: Users,
              color: 'text-green-600',
              bgColor: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Active Subjects',
              value: stats.totalSubjects.toString(),
              change: '+5%',
              trend: 'up',
              icon: BookOpen,
              color: 'text-purple-600',
              bgColor: 'bg-purple-100 dark:bg-purple-900/20'
            },
            {
              title: 'Pending Requests',
              value: stats.pendingRequests.toString(),
              change: '-8%',
              trend: 'down',
              icon: AlertCircle,
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
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          stat.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {stat.change} from last month
                      </div>
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Link href={action.href}>
                      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                        action.urgent ? 'border-orange-200 bg-orange-50/50 dark:bg-orange-900/10' : 'hover:border-blue-200'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} flex-shrink-0`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {action.title}
                                </h3>
                                {action.badge && (
                                  <Badge variant={action.urgent ? 'destructive' : 'secondary'}>
                                    {action.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {action.description}
                              </p>
                              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
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
                      dataKey="requests" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      name="Requests"
                    />
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

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
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
                    action: 'Timetable generated for Computer Science Semester 5',
                    time: '2 hours ago',
                    status: 'success',
                    icon: CheckCircle
                  },
                  {
                    action: 'Leave request submitted by Dr. Sarah Wilson',
                    time: '4 hours ago',
                    status: 'pending',
                    icon: AlertCircle
                  },
                  {
                    action: 'New faculty member added to Electronics department',
                    time: '1 day ago',
                    status: 'success',
                    icon: Users
                  },
                  {
                    action: 'Subject curriculum updated for IT department',
                    time: '2 days ago',
                    status: 'success',
                    icon: BookOpen
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
    </DashboardLayout>
  );
}