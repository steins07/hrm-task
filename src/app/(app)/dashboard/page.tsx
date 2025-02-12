"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import ApiResponse from "@/types/ApiResponse"

import { IUser } from "@/model/AllModels"

interface Employee {
  id: string
  name: string
  email: string
  department: string
}

interface Attendance {
  date: string
  checkIn: string
  checkOut: string
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [hrAttendance, setHrAttendance] = useState<Attendance | null>(null)
  const [checkInTime, setCheckInTime] = useState("")
  const [checkOutTime, setCheckOutTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<IUser[] | null>(null)
  const { toast } = useToast();

  const getAllUsers = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/get-all-user");
        console.log(response.data?.messages);
        setUsers(response.data?.messages);
        console.log(users)

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast({
          title: "Error",
          description:
            axiosError.response?.data.messages ||
            "Failed to fetch message settings",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    getAllUsers()
    console.log(users)
    // TODO: Fetch actual HR attendance data from the API
    const mockHrAttendance: Attendance = {
      date: "2025-02-11",
      checkIn: "09:00",
      checkOut: "17:00",
    }
    setHrAttendance(mockHrAttendance)
  }, [getAllUsers])



  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual API call to add attendance
    const newAttendance: Attendance = {
      date: new Date().toISOString().split("T")[0],
      checkIn: checkInTime,
      checkOut: checkOutTime,
    }
    setHrAttendance(newAttendance)
    setCheckInTime("")
    setCheckOutTime("")
    alert("Attendance added successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <Button asChild>
          <Link href="/leave-requests">View Leave Requests</Link>
        </Button>
        <Button asChild>
          <Link href="/add-employee">Add New Employee</Link>
        </Button>
      </div>
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
            <Button className="mt-4">Record Attendance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Your Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAttendance} className="space-y-4">
              <div>
                <Label htmlFor="checkIn">Check-in Time</Label>
                <Input
                  type="time"
                  id="checkIn"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out Time</Label>
                <Input
                  type="time"
                  id="checkOut"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Add Attendance</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      {!isLoading && users ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((user: IUser, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                {/* <td className="py-2 px-4 border-b">{employee.department}</td> */}
                <td className="py-2 px-4 border-b">
                  <Button asChild variant="outline" className="mr-2">
                    <Link href={`/employee/${user._id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/employee/${user._id}/edit`}>Edit</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>no employee.</p>}

    </div>
  )
}

