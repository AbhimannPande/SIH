'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap,
  GraduationCap,
  UserCheck,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const roleCards = [
  {
    role: 'student',
    title: 'Student Portal',
    description: 'Access your class schedules, exam dates, and faculty information',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    features: ['View Timetables', 'Exam Schedules', 'Faculty Directory', 'Class Updates']
  },
  {
    role: 'teacher',
    title: 'Faculty Dashboard',
    description: 'Manage your classes, submit requests, and view your schedule',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-500',
    features: ['Class Management', 'Leave Requests', 'Schedule View', 'Student Lists']
  },
  {
    role: 'admin',
    title: 'Administrator Panel',
    description: 'Complete control over timetables, faculty, and system management',
    icon: Settings,
    color: 'from-purple-500 to-violet-500',
    features: ['Timetable Generation', 'Faculty Management', 'Analytics', 'System Control']
  }
];

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automated timetable generation with conflict detection and optimization'
  },
  {
    icon: Users,
    title: 'Multi-Role Support',
    description: 'Seamless experience for students, teachers, and administrators'
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Instant notifications for schedule changes and important announcements'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control'
  }
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduScheduler
              </h1>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Smart Classroom
              <span className="block text-3xl md:text-5xl text-gray-600 dark:text-gray-300">
                & Timetable Management
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionize your educational institution with our AI-powered scheduling system. 
              Automated timetable generation, conflict resolution, and seamless management for 
              students, teachers, and administrators.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-center mb-4">Choose Your Role</DialogTitle>
                  </DialogHeader>
                  <div className="grid md:grid-cols-3 gap-4">
                    {roleCards.map((card) => (
                      <motion.div
                        key={card.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                          <CardHeader className="text-center pb-3">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                              <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                            <div className="space-y-2 mb-4">
                              {card.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-xs text-gray-500">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                            <Link href={`/login?role=${card.role}`}>
                              <Button className="w-full" variant="outline">
                                Continue as {card.title.split(' ')[0]}
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">New to EduScheduler?</p>
                    <Link href="/register">
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                        Create New Account
                      </Button>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-gray-50">
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { number: '1000+', label: 'Students' },
                { number: '50+', label: 'Teachers' },
                { number: '15+', label: 'Departments' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              ✨ Features
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage your institution
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to streamline your educational operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to transform your institution?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of educational institutions already using EduScheduler
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
                  Start Your Free Trial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center mb-4">Choose Your Role</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-4">
                  {roleCards.map((card) => (
                    <motion.div
                      key={card.role}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                        <CardHeader className="text-center pb-3">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                            <card.icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                          <Link href={`/login?role=${card.role}`}>
                            <Button className="w-full" variant="outline">
                              Continue as {card.title.split(' ')[0]}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">EduScheduler</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 EduScheduler. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}