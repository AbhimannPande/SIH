'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useMockApi } from '@/lib/hooks/useMockApi';

const departments = [
  'Computer Science',
  'Information Technology', 
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const mockFacultyData = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@college.edu',
    phone: '+1-555-0123',
    department: 'Computer Science',
    designation: 'Professor',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
    experience: '12 years',
    qualification: 'Ph.D. Computer Science',
    availability: 'Available',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Dr. John Smith',
    email: 'john.smith@college.edu',
    phone: '+1-555-0124',
    department: 'Computer Science',
    designation: 'Associate Professor',
    subjects: ['Web Development', 'Software Engineering'],
    experience: '8 years',
    qualification: 'Ph.D. Software Engineering',
    availability: 'Busy',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Dr. Emily Brown',
    email: 'emily.brown@college.edu',
    phone: '+1-555-0125',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    subjects: ['Operating Systems', 'Computer Networks'],
    experience: '5 years',
    qualification: 'Ph.D. Information Technology',
    availability: 'Available',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function FacultyPage() {
  const [faculty, setFaculty] = useState(mockFacultyData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.subjects.some(subject => 
                           subject.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const facultyByDepartment = departments.reduce((acc, dept) => {
    acc[dept] = faculty.filter(member => member.department === dept);
    return acc;
  }, {});

  const facultyStats = {
    total: faculty.length,
    available: faculty.filter(f => f.availability === 'Available').length,
    busy: faculty.filter(f => f.availability === 'Busy').length,
    avgExperience: Math.round(faculty.reduce((sum, f) => sum + parseInt(f.experience), 0) / faculty.length)
  };

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
              Faculty Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage faculty members, their details, and assignments
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Faculty Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Dr. John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="john.doe@college.edu" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+1-555-0123" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professor">Professor</SelectItem>
                          <SelectItem value="associate">Associate Professor</SelectItem>
                          <SelectItem value="assistant">Assistant Professor</SelectItem>
                          <SelectItem value="lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Experience (Years)</Label>
                      <Input type="number" placeholder="5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Qualification</Label>
                    <Input placeholder="Ph.D. Computer Science" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Add Faculty</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Faculty',
              value: facultyStats.total.toString(),
              icon: Users,
              color: 'text-blue-600',
              bgColor: 'bg-blue-100 dark:bg-blue-900/20'
            },
            {
              title: 'Available',
              value: facultyStats.available.toString(),
              icon: Calendar,
              color: 'text-green-600',
              bgColor: 'bg-green-100 dark:bg-green-900/20'
            },
            {
              title: 'Busy',
              value: facultyStats.busy.toString(),
              icon: BookOpen,
              color: 'text-orange-600',
              bgColor: 'bg-orange-100 dark:bg-orange-900/20'
            },
            {
              title: 'Avg Experience',
              value: `${facultyStats.avgExperience} years`,
              icon: Award,
              color: 'text-purple-600',
              bgColor: 'bg-purple-100 dark:bg-purple-900/20'
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search faculty by name, email, or subjects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Faculty</TabsTrigger>
              <TabsTrigger value="department">By Department</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid gap-6">
                {filteredFaculty.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {member.name}
                                </h3>
                                <Badge 
                                  variant={member.availability === 'Available' ? 'default' : 'secondary'}
                                  className={member.availability === 'Available' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                  }
                                >
                                  {member.availability}
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {member.designation} • {member.department}
                              </p>
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Mail className="w-4 h-4" />
                                  <span>{member.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Award className="w-4 h-4" />
                                  <span>{member.qualification}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{member.experience} experience</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Subjects Teaching:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {member.subjects.map((subject, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="department" className="space-y-6">
              <div className="grid gap-6">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{dept}</span>
                          <Badge variant="secondary">
                            {facultyByDepartment[dept]?.length || 0} members
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {facultyByDepartment[dept]?.map((member) => (
                            <div key={member.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                              <Avatar>
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{member.designation}</p>
                                <p className="text-xs text-gray-500">{member.subjects.length} subjects</p>
                              </div>
                              <Badge 
                                variant={member.availability === 'Available' ? 'default' : 'secondary'}
                                className={member.availability === 'Available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                                }
                              >
                                {member.availability}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {faculty.filter(f => f.designation === 'Professor').length}
                    </div>
                    <p className="text-sm text-gray-600">Senior faculty</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Associate Professors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {faculty.filter(f => f.designation === 'Associate Professor').length}
                    </div>
                    <p className="text-sm text-gray-600">Mid-level faculty</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Assistant Professors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {faculty.filter(f => f.designation === 'Assistant Professor').length}
                    </div>
                    <p className="text-sm text-gray-600">Junior faculty</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{departments.length}</div>
                    <p className="text-sm text-gray-600">Active departments</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}