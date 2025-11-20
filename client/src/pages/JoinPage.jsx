import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { joinD4C } from '@/services/auth.service';
import { toast } from 'sonner';

export default function JoinPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await joinD4C(data);
      toast.success('Application submitted successfully! Your application is under review.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Join Dance For Change</CardTitle>
            <CardDescription>
              Fill out the form below to request membership. Your application will be reviewed by our admin team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="danceStyle">Dance Style</Label>
                <Input
                  id="danceStyle"
                  {...register('danceStyle')}
                  placeholder="e.g., Hip-Hop, Contemporary, Ballet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio', { maxLength: 500 })}
                  placeholder="Tell us about yourself and why you want to join D4C..."
                  rows={4}
                />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
