import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '@/store/store';
import { signUpThunk } from '@/store/thunk/auth';
import { API_Response_status, type SignUpResponse } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

// Regex patterns
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_-]{2,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z.object({
  user_name: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(usernameRegex, {
      message:
        'Username can only contain letters, numbers, hyphens, and underscores',
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .regex(emailRegex, { message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(passwordRegex, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await dispatch(signUpThunk(values));
      const response = res.payload as SignUpResponse;
      if (response.status === API_Response_status.SUCCESS) {
        toast.success(response.message || 'user is created');
        navigate('/dashboard', { replace: true });
      } else {
        toast.warning(response.message || 'something went wrong!');
      }
      form.reset();
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (fieldName: keyof z.infer<typeof formSchema>) => {
    const fieldState = form.getFieldState(fieldName);
    const fieldValue = form.watch(fieldName);

    if (!fieldValue) return null;
    if (fieldState.error) return 'error';
    if (fieldValue && !fieldState.error) return 'success';
    return null;
  };

  const StatusIcon = ({ status }: { status: string | null }) => {
    if (status === 'success')
      return <CheckCircle2 size={16} className="text-green-500" />;
    if (status === 'error')
      return <XCircle size={16} className="text-red-500" />;
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl border-0  backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-violet-50">
            Create Account
          </CardTitle>
          <p className="text-sm text-violet-600 text-center">
            Join us today and get started
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="your_username"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                        <div className="absolute right-3">
                          <StatusIcon status={getFieldStatus('user_name')} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                    <p className="text-xs text-gray-500 mt-1">
                      2-20 characters, letters, numbers, hyphens, and
                      underscores only
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3  h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                        <div className="absolute right-3 ">
                          <StatusIcon status={getFieldStatus('email')} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3  h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-20 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          autoComplete="off"
                        />
                        <div className="absolute right-10 ">
                          <StatusIcon status={getFieldStatus('password')} />
                        </div>
                        <button
                          type="button"
                          className="absolute right-3  text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>Password must contain:</p>
                      <ul className="ml-2 space-y-0.5">
                        <li>• At least 8 characters</li>
                        <li>• One uppercase & lowercase letter</li>
                        <li>• One number & one special character</li>
                      </ul>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </Form>
        </CardContent>

        <CardFooter className="pt-6">
          <p className="text-xs text-gray-500 text-center w-full">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
