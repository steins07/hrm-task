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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { User } from "next-auth"
import { useSession } from "next-auth/react"




interface Attendance {
  date: string
  checkIn: string
  checkOut: string
}

export default function Dashboard() {
  const { data: session } = useSession();
    const user: User = session?.user as User;
  const [hrAttendance, setHrAttendance] = useState<Attendance>({
    date: new Date().toISOString().split("T")[0],
    checkIn: "No check in time recorded",
    checkOut: "No check out time recorded",
  })
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [disableButton, setDisableButton] = useState(false)
  const [itemsPerPage] = useState(5)
  const { toast } = useToast();

  // Get current employees
  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = users.slice(indexOfFirstEmployee, indexOfLastEmployee)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const getAllUsers = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-all-user");
          setUsers(response.data?.messages||[]);
        
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
    [toast,setUsers]
  );

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

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  const handleSubmitAttendance = async (checkIn: Date, checkOut: Date) => {
    if (!checkIn && !checkOut) {
      toast({
        title: "Cannot Submit Attendance",
        description: "Please enter check in and check out time",
        variant: "destructive"
      })
    }


    try {
      console.log("from handle submit att: ", checkIn, checkOut)
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
  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInTime && checkOutTime) {
      const newAttendance: Attendance = {
        date: new Date().toISOString().split("T")[0],
        checkIn: checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        checkOut: checkOutTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      }
      setHrAttendance(newAttendance)
      toast({
        title: "Attendance Recorded",
        description: "Successfully recorded attendance",
        variant: "default"
      })
    }

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>
      {user?.role === "HR" && (<div className="flex space-x-4 mb-4">
        <Button asChild>
          <Link href="/leave-requests">View Leave Requests</Link>
        </Button>
        <Button asChild>
          <Link href="/add-employee">Add New Employee</Link>
        </Button>
      </div>)}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Attendance</h2>
        {hrAttendance ? (
          <p>
            Date: {hrAttendance.date}
            <br />
            Check-in: {hrAttendance.checkIn}
            <br />
            Check-out: {hrAttendance.checkOut}
          </p>
        ) : (
          <p>No attendance recorded for today</p>
        )}
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
                  value={checkInTime ? checkInTime.toISOString().slice(0, 16) : ""}
                  onChange={(e) => setCheckInTime(new Date(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Time</Label>
                <Input
                  type="datetime-local"
                  id="checkOut"
                  value={checkOutTime ? checkOutTime.toISOString().slice(0, 16) : ""}
                  onChange={(e) => setCheckOutTime(new Date(e.target.value))}
                />
              </div>
              <Button type="submit">Add Attendance</Button>
            </form>
          </DialogContent>
        </Dialog>
        {checkInTime && checkOutTime && <Button className="ml-2" onClick={() => handleSubmitAttendance(checkInTime, checkOutTime)}>Submit Attendance</Button>}
      </div>
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      {!isLoading && users ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentEmployees.map((user: IUser, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b gap-2">
                  <Button asChild variant="outline" className="mr-2">
                    <Link href={`/employee/${user._id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="mr-2">
                    <Link href={`/employee/${user._id}/edit`}>Edit</Link>
                  </Button>
                  <AlertDialog >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete {user.username}&apos;s account and remove
                          their data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteEmployee(user._id as string)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>no employee.</p>}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => paginate(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(Math.ceil(users.length / itemsPerPage))].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href="#" onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => paginate(currentPage + 1)}
                className={
                  currentPage === Math.ceil(users.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

