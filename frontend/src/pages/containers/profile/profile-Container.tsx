import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Loader2,
  User,
  Lock,
  Trash2,
  AlertTriangle,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { API_Response_status } from '@/types/auth';
import { fetchProfileThunk } from '@/store/thunk/user';
import { removeCookie } from '@/lib/secureCookies';
import { LOCAL_AUTH_KEYS } from '@/config/keys.config';

const usernameRegex = /^[a-zA-Z0-9_-]{2,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation schemas
const profileSchema = z.object({
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
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const deleteAccountSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required to delete account')
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmation: z.string().min(1, "Please type 'DELETE' to confirm"),
  })
  .refine((data) => data.confirmation === 'DELETE', {
    message: "Please type 'DELETE' to confirm",
    path: ['confirmation'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

function ProfileContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, profile } = useSelector(
    (state: RootState) => state.profile
  );

  // Dialog states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Loading states
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form configurations
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'all',
    defaultValues: {
      user_name: profile?.user_name,
      email: profile?.email,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'all',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const deleteAccountForm = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'all',
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  // API call functions
  const updateProfile = async (data: ProfileFormData) => {
    setIsProfileLoading(true);
    try {
      const response = await axiosInstance.post('/user/update', {
        user_name: data.user_name,
        email: data.email,
      });

      if (response.data.status === API_Response_status.SUCCESS) {
        setIsEditingProfile(false);
        dispatch(fetchProfileThunk());
        toast(
          response.data.message || 'Your profile has been updated successfully.'
        );
      }
    } catch (error) {
      console.log('➡ ~ updateProfile ~ error:', error);
      toast('Failed to update profile. Please try again.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const changePassword = async (data: PasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.data.status === API_Response_status.SUCCESS) {
        toast(
          response.data.message ||
            'Your password has been changed successfully.'
        );
        setPasswordDialogOpen(false);
        passwordForm.reset();
        return;
      } else {
        passwordForm.reset();
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('➡ ~ changePassword ~ error:', error);
      toast('Failed to change password. Please check your current password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const deleteAccount = async (data: DeleteAccountFormData) => {
    setIsDeleteLoading(true);
    try {
      const response = await axiosInstance.post('/auth/delete-account', {
        password: data.password,
      });

      if (response.data.status === API_Response_status.SUCCESS) {
        toast(
          response.data.message || 'Your account has been deleted successfully.'
        );
        removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_STATUS });
        removeCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
        setDeleteDialogOpen(false);
        window.location.href = '/';
        deleteAccountForm.reset();
        return;
      } else {
        throw new Error(response.data.message || 'Failed to delete account');
      }

      // Redirect to login or home page
    } catch (error) {
      console.error('➡ ~ deleteAccount ~ error:', error);
      toast('Failed to delete account. Please check your password.');
      deleteAccountForm.reset();
    } finally {
      deleteAccountForm.reset();  
      setIsDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditProfile = () => {
    profileForm.reset({
      user_name: profile?.user_name,
      email: profile?.email,
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    profileForm.reset();
  };

  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              {!isEditingProfile && !isLoading && (
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <CardDescription>Your basic profile information.</CardDescription>
          </CardHeader>
          {isLoading ? (
            <Skeleton className="h-40 w-[96%] mx-auto" />
          ) : (
            <CardContent>
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <p className="text-lg">{profile?.user_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-lg">{profile?.email}</p>
                  </div>
                </div>
              ) : (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(updateProfile)}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
                      name="user_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isProfileLoading}>
                        {isProfileLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          )}
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and email settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your account password
                </p>
              </div>
              <Dialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(changePassword)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter current password"
                                  type={
                                    showCurrentPassword ? 'text' : 'password'
                                  }
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                  }
                                >
                                  {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter new password"
                                  type={showNewPassword ? 'text' : 'password'}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Confirm new password"
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPasswordDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isPasswordLoading}>
                          {isPasswordLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Change Password
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data.
              </AlertDescription>
            </Alert>

            <Dialog open={deleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteAccountForm.reset();
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <Form {...deleteAccountForm}>
                  <form
                    onSubmit={deleteAccountForm.handleSubmit(deleteAccount)}
                    className="space-y-4"
                  >
                    <FormField
                      control={deleteAccountForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={deleteAccountForm.control}
                      name="confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type "DELETE" to confirm</FormLabel>
                          <FormControl>
                            <Input placeholder="DELETE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={isDeleteLoading}
                      >
                        {isDeleteLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfileContainer;
