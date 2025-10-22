'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft, Calendar, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuthStore } from '@/lib/stores/authStore';
import { useMockApi } from '@/lib/hooks/useMockApi';
import {
  studentRegisterSchema,
  teacherRegisterSchema,
  StudentRegisterFormData,
  TeacherRegisterFormData
} from '@/lib/validations/auth';

function RegisterContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as 'student' | 'teacher' | 'admin') || 'student';

  const { login } = useAuthStore();
  const { register: mockRegister, loading } = useMockApi();

  // Block admin registration
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              Admin registration is not available. Admin credentials are pre-configured for security.
            </p>
            <Link href="/login?role=admin">
              <Button className="w-full">Admin Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isStudent = role === 'student';
  const schema = isStudent ? studentRegisterSchema : teacherRegisterSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<StudentRegisterFormData | TeacherRegisterFormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: StudentRegisterFormData | TeacherRegisterFormData) => {
    try {
      setError('');
      const newUser = await mockRegister(data, role);
      login(newUser);

      // Redirect
      const redirectPath = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      router.push(redirectPath);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 shadow-lg">
          {/* Back to Home (top-left) */}
          <div className="absolute top-4 left-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>

          <CardHeader className="space-y-1 pt-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduScheduler
              </h1>
            </div>
            <CardTitle className="text-2xl font-bold text-center capitalize">{role} Registration</CardTitle>
            <CardDescription className="text-center">
              Create your {role} account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-white/50 dark:bg-gray-700/50"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/50 dark:bg-gray-700/50"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Role-specific fields */}
              {isStudent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      {...register('phone' as keyof StudentRegisterFormData)}
                      type="tel"
                      placeholder="Enter your phone number"
                      className="bg-white/50 dark:bg-gray-700/50"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stream">Stream</Label>
                      <Select onValueChange={(value) => setValue('stream' as keyof StudentRegisterFormData, value)}>
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Civil">Civil</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.stream && <p className="text-sm text-red-500">{errors.stream.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select onValueChange={(value) => setValue('year' as keyof StudentRegisterFormData, parseInt(value))}>
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select onValueChange={(value) => setValue('semester' as keyof StudentRegisterFormData, parseInt(value))}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.semester && <p className="text-sm text-red-500">{errors.semester.message}</p>}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Teacher ID</Label>
                  <Input
                    {...register('teacherId' as keyof TeacherRegisterFormData)}
                    type="text"
                    placeholder="Enter your teacher ID"
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                  {errors.teacherId && <p className="text-sm text-red-500">{errors.teacherId.message}</p>}
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="bg-white/50 dark:bg-gray-700/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="bg-white/50 dark:bg-gray-700/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Sign In link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  href={`/login?role=${role}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
