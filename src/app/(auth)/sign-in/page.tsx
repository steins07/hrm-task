"use client";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();

    //zod implementation
    const form = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: { identifier: string, password: string }) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        if (result?.error) {
            if (result.error == "CredentialsSignin") {
                toast({
                    title: "Signin Failed",
                    description: "Invalid credentials",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Signin Failed",
                    description: result.error,
                    variant: "destructive",
                });
            }
            setIsSubmitting(false);
        }

        if (result?.url) {
            router.replace("/dashboard");
            setIsSubmitting(false);
        }
    };

    return (
        //outside div
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                {/* welcome */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Login To <br/> <i>Matrix</i> <span className="text-3xl">HRM</span>
                    </h1>
                    <p className="mb-4">Let&apos;s sign in to your account</p>
                </div>

                {/* form */}
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* email field */}
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email / Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* password field */}
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                "SignIn"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default SignIn;