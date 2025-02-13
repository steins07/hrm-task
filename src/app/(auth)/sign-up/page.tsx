'use client'

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"
import IApiResponse from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
// import { Role } from "@/model/AllModels";

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            role: 'EMPLOYEE',
        }
    });

    const onSubmit = async (data: { username: string, email: string, password: string, role: string }) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<IApiResponse>(`/api/sign-up`, data);
            toast({
                title: 'Success',
                description: response.data?.messages
            });
            router.replace(`/sign-in`);
        } catch (error) {
            console.error("Error in signup of user: ", error);
            const axiosError = error as AxiosError<IApiResponse>;
            const errorMessage = axiosError.response?.data.messages;
            toast({
                title: 'Signup Failed',
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Create your Matrix HMR Account
                    </h1>
                    <p className="mb-4">
                        Sign up to start using Matrix HRM
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField name="username" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter username here..." {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email here.." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password here..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="role" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded">
                                        <option value="">Select role...</option>
                                        <option value="HR">HR</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="EMPLOYEE">EMPLOYEE</option>
                                        <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button className="ml-36" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                </>
                            ) : ('Signup')}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member? &nbsp;
                        <Link href="/sign-in" className="text-blue-600">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page;
