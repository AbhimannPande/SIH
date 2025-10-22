'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock,
  Download,
  Filter
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useMockApi } from '@/lib/hooks/useMockApi';

const weeklyData = [
  { name: 'Mon', students: 1200, teachers: 82, classes: 145, requests: 5 },
  { name: 'Tue', students: 1180, teachers: 85, classes: 142, requests: 8 },
  { name: 'Wed', students: 1220, teachers: 83, classes: 148, requests: 3 },
  { name: 'Thu', students: 1190, teachers: 84, classes: 140, requests: 12 },
  { name: 'Fri', students: 1160, teachers: 81, classes: 138, requests: 7 },
  { name: 'Sat', students: 980, teachers: 65, classes: 95, requests: 2 },
];

const departmentData = [
  { name: 'Computer Science', students: 450, color: '#3B82F6' },
  { name: 'Information Technology', students: 380, color: '#10B981' },
  { name: 'Electronics', students: 320, color: '#F59E0B' },
  { name: 'Mechanical', students: 290, color: '#EF4444' },
  { name: 'Civil', students: 260, color: '#8B5CF6' },
  { name: 'Electrical', students: 240, color: '#06B6D4' },
];

const timetableEfficiency = [
  { semester: 'Sem 1', efficiency: 92, conflicts: 2 },
  { semester: 'Sem 2', efficiency: 88, conflicts: 5 },
  { semester: 'Sem 3', efficiency: 95, conflicts: 1 },
  { semester: 'Sem 4', efficiency: 90, conflicts: 3 },
  { semester: 'Sem 5', efficiency: 93, conflicts: 2 },
  { semester: 'Sem 6', efficiency: 87, conflicts: 6 },
  { semester: 'Sem 7', efficiency: 91, conflicts: 4 },
  { semester: 'Sem 8', efficiency: 89, conflicts: 3 },
];

const monthlyTrends = [
  { month: 'Jan', newStudents: 45, facultyRequests: 12, timetableChanges: 8 },
  { month: 'Feb', newStudents: 38, facultyRequests: 18, timetableChanges: 15 },
  { month: 'Mar', newStudents: 52, facultyRequests: 22, timetableChanges: 12 },
  { month: 'Apr', newStudents: 61, facultyRequests: 15, timetableChanges: 9 },
  { month: 'May', newStudents: 35, facultyRequests: 8, timetableChanges: 5 },
  { month: 'Jun', newStudents: 48, facultyRequests: 25, timetableChanges: 18 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

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
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive insights into your institution's performance
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Students',
              value: '1,250',
              change: '+12%',
              trend: 'up',
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Active Faculty',
              value: '85',
              change: '+3%',
              trend: 'up',
              icon: Users,
              color: 'text-green-600',
              bgColor: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Weekly Classes',
              value: '142',
              change: '-2%',
              trend: 'down',
              icon: Calendar,
              color: 'text-purple-600',
              bgColor: 'bg-purple-100 dark:bg-purple-900/20'
            },
            {
              title: 'Avg Efficiency',
              value: '91%',
              change: '+5%',
              trend: 'up',
              icon: BarChart3,
              color: 'text-orange-600',
              bgColor: 'bg-orange-100 dark:bg-orange-900/20'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {metric.value}
                      </p>
                      <div className={`flex items-center mt-2 text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.change} from last {timeRange}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      name="Students"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="classes" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      name="Classes"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#F59E0B" 
                      strokeWidth={2} 
                      name="Requests"
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
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="students"
                    >
                      {departmentData.map((entry, index) => (
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

        {/* Timetable Efficiency & Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timetable Efficiency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Timetable Efficiency by Semester</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timetableEfficiency}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="semester" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#3B82F6" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="newStudents" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                      name="New Students"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="facultyRequests" 
                      stackId="1" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Faculty Requests"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="timetableChanges" 
                      stackId="1" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      fillOpacity={0.6}
                      name="Timetable Changes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Attendance Rate</h4>
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600">+2.1% from last month</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Class Utilization</h4>
                  <div className="text-2xl font-bold text-blue-600">87.5%</div>
                  <p className="text-sm text-gray-600">+1.8% from last month</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Faculty Satisfaction</h4>
                  <div className="text-2xl font-bold text-purple-600">4.6/5</div>
                  <p className="text-sm text-gray-600">+0.2 from last month</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">System Uptime</h4>
                  <div className="text-2xl font-bold text-orange-600">99.9%</div>
                  <p className="text-sm text-gray-600">Excellent performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}