"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import IApiResponse from "@/types/ApiResponse"
import { IUser } from "@/model/AllModels"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import EmployeeTable from "@/components/EmployeeTable"
import Paginator from "@/components/Paginator"
import { Separator } from "@/components/ui/separator"

interface Attendance {
  date: string
  checkIn: string
  checkOut: string
}
interface LastAttendance {
  date: string
  checkIn: string
  checkOut: string
  createdAt?: string
  updatedAt?: string
}
export default function Dashboard() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [disableButton, setDisableButton] = useState(false)
  const [itemsPerPage] = useState(4)
  const [lastAttendance, setLastAttendance] = useState<LastAttendance | null>(null)
  const { toast } = useToast();

  // Get current employees
  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = users.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const [hrAttendance, setHrAttendance] = useState<Attendance>({
    date: new Date().toISOString().split("T")[0],
    checkIn: "No check in time recorded",
    checkOut: "No check out time recorded",
  })



  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  //api call to get all user
  const getAllUsers = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-all-user");
        setUsers(response.data?.messages || []);
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        toast({
          title: "Error",
          description:
            axiosError.response?.data.messages ||
            "Failed to fetch user",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, setUsers]
  );

  const getRecentAttendance = useCallback(async () => {
    try {
      const res = await axios.get(`/api/get-attendance/${user?._id}`);
      setLastAttendance(res.data.lastAttendance);
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.messages,
        variant: "destructive",
      });
    }
  }, [user?._id, toast]);



  useEffect(() => {
    getAllUsers();
    if (user) {
      getRecentAttendance();
    }
  }, [getAllUsers, getRecentAttendance, user])


  //api call to delete employee
  const handleDeleteEmployee = async (id: string) => {
    try {
      const res = await axios.delete(`/api/delete-employee/${id}`)
      if (res.data.success === true) {
        toast({
          title: 'Success',
          description: res.data.messages,
          variant: "default"
        });
        getAllUsers();
      }
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: 'Failed to delete user',
        description: axiosError.response?.data.messages,
        variant: "destructive"
      })
    }
  }

  //api call to submit attendance
  const handleSubmitAttendance = async (checkIn: Date, checkOut: Date) => {
    if (!checkIn && !checkOut) {
      toast({
        title: "Cannot Submit Attendance",
        description: "Please enter check in and check out time",
        variant: "destructive"
      })
    }
    try {
      const res = await axios.post(`/api/add-attendance`, { data: { checkIn, checkOut } })
      toast({
        title: "Success",
        description: res.data.messages,
        variant: "default"
      })
      setCheckInTime(null)
      setCheckOutTime(null)
      setDisableButton(true)
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>
      toast({
        title: "Failed to submit attendance",
        description: axiosError.response?.data.messages,
        variant: "destructive"
      })
    }
  }


  //handle form data changes
  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInTime && checkOutTime) {
      // Convert local time to UTC
      const checkInUTC = new Date(checkInTime.getTime() - checkInTime.getTimezoneOffset() * 60000);
      const checkOutUTC = new Date(checkOutTime.getTime() - checkOutTime.getTimezoneOffset() * 60000);

      const newAttendance: Attendance = {
        date: new Date().toISOString().split("T")[0],
        checkIn: checkInUTC.toISOString(), // Send UTC time to server
        checkOut: checkOutUTC.toISOString(), // Send UTC time to server
      };

      setHrAttendance(newAttendance);
      toast({
        title: "Attendance Recorded",
        description: "Successfully recorded attendance",
        variant: "default",
      });
    }
  };


  if (isLoading) {
    return <div className="flex items-center justify-center text-5xl pr-5">
      Loading <Loader2 className="animate-spin inline w-16 h-16 duration-1000" />
    </div>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {user?.role === "EMPLOYEE" && <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>}
      {user?.role === "HR" && <h1 className="text-3xl font-bold mb-4">HR Dashboard</h1>}
      {user?.role === "MANAGER" && <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>}
      {user?.role === "SUPER_ADMIN" && <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>}

      <Separator className="mb-4 drop-shadow-xl" />
      {user?.role === "HR" && (<div className="flex space-x-4 mb-4 pl-5">
        <Button asChild>
          <Link href="/leave-requests">View Leave Requests</Link>
        </Button>
        <Button asChild>
          <Link href="/add-employee">Add New Employee</Link>
        </Button>
      </div>)
      }
      <Separator className="mb-4 drop-shadow-xl" />
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Role: {user?.role}</h2>
        <h2 className="text-xl font-semibold mb-4">Record Your Attendance</h2>
        <p>
          Date: {hrAttendance.date}
          <br />
          Check-in: {hrAttendance.checkIn}
          <br />
          Check-out: {hrAttendance.checkOut}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={disableButton} className="mt-4">Record Attendance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Your Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAttendance} className="space-y-4">
              <div>
                <Label htmlFor="checkIn">Check-in Time</Label>
                <Input
                  type="datetime-local"
                  id="checkIn"
                  value={checkInTime ? new Date(checkInTime.getTime() - checkInTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setCheckInTime(new Date(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Time</Label>
                <Input
                  type="datetime-local"
                  id="checkOut"
                  value={checkOutTime ? new Date(checkOutTime.getTime() - checkOutTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}

                  onChange={(e) => setCheckOutTime(new Date(e.target.value))}
                />
              </div>
              <Button type="submit">Add Attendance</Button>
            </form>
          </DialogContent>
        </Dialog>
        {checkInTime && checkOutTime && <Button className="ml-2" onClick={() => {
          handleSubmitAttendance(checkInTime, checkOutTime)
          window.location.reload()
        }}>Submit Attendance</Button>}
      </div>
      {lastAttendance && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Last Attendance</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Check In</th>
                <th className="py-2 px-4 border-b">Check Out</th>
              </tr>
            </thead>
            <tbody>
                <tr className="text-center">
                  <td className="py-2 px-4 border-b">{formatDate(lastAttendance.checkIn)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(lastAttendance.checkOut)}</td>
                </tr>
            </tbody>
          </table>
        </div>
      )}
      {lastAttendance===null && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Last Attendance</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Check In</th>
                <th className="py-2 px-4 border-b">Check Out</th>
              </tr>
            </thead>
            <tbody>
                <tr className=" text-center text-lg font semi-bold">
                  <td colSpan={2}>No attendance to display</td>
                </tr>
            </tbody>
          </table>
        </div>
      )}

      {user?.role === "HR" && <>
        <h2 className="text-2xl font-bold mb-4">Employee List</h2>
        {!isLoading && users ? (
          <EmployeeTable currentEmployees={currentEmployees} handleDeleteEmployee={handleDeleteEmployee} />
        ) : (
          <p>no employee.</p>
        )
        }
        <Paginator users={users} itemsPerPage={itemsPerPage} currentPage={currentPage} paginate={paginate} />
      </>}
    </div>
  )
}

