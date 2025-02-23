"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const router = useRouter();

    return (
        <nav className="p-2 md:p-4 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="/dashboard" className="text-xl font-bold mb-4 md:mb-0">
                    <i>Matrix</i> HRM
                </a>
                {session ? (
                    <>
                        <span className="mr-4">Welcome, {user.username || user.email}</span>
                        <Button
                            onClick={() => {
                                signOut({callbackUrl: "/"});
                                router.push("/")
                            }
                            }
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button
                                className="w-full md:w-auto bg-slate-100 text-black"
                                variant={"outline"}
                            >
                                Login
                            </Button>
                        </Link>

                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;