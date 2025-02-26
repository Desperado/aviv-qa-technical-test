import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, Lock, Camera } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  // If one password field is filled, both must be filled
  if (data.currentPassword || data.newPassword) {
    return data.currentPassword && data.newPassword;
  }
  return true;
}, {
  message: "Both current and new password are required to change password",
  path: ["newPassword"],
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const Settings = () => {
  const { user, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsSubmitting(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user data
      const updatedUser = {
        ...user!,
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      login(updatedUser);
      setSuccessMessage('Settings updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker and handle image upload
    alert('Avatar upload functionality would be implemented here');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={user?.name}
                className="w-20 h-20 rounded-full"
              />
              <button
                type="button"
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md" data-test-id="success-message">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <Input
                label="Full Name"
                error={errors.name?.message}
                {...register('name')}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <Input
                label="Email Address"
                type="email"
                error={errors.email?.message}
                {...register('email')}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <Input
                label="Phone Number"
                type="tel"
                error={errors.phone?.message}
                {...register('phone')}
                className="flex-1"
              />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <Input
                    label="Current Password"
                    type="password"
                    error={errors.currentPassword?.message}
                    {...register('currentPassword')}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <Input
                    label="New Password"
                    type="password"
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};