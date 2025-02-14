'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import IApiResponse from '@/types/ApiResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserData {
  username: string, 
  email: string, 
  role: string
}

const EditEmployee = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<UserData>({
    defaultValues: {
      username: '',
      email: '',
      role: '',
    },
  });

  const fetchEmployee = useCallback(async () => {
    try {
      const response = await axios.post(`/api/get-single-employee`, { id });
      const employeeData = response?.data.data.user;
      form.setValue('username', employeeData.username);
      form.setValue('email', employeeData.email);
      form.setValue('role', employeeData.role);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const onSubmit = async (data: UserData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating employee:', data);
      const res = await axios.post<IApiResponse>(`/api/update-employee`, { id, ...data });
      if (res.data.success === true) {
        toast({ title: 'Success', description: 'Employee updated successfully!' });
      }
      router.push(`/employee/${id}`);
    } catch (error) {
      console.error('Error updating employee:', error);
      const axiosError = error as AxiosError<IApiResponse>;
      const errorMessage = axiosError.response?.data.messages;
      toast({ title: 'Update Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Edit Employee</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="username" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="role" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="HR">HR</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : ('Update Employee')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditEmployee;
