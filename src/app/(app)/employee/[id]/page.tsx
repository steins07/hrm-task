"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { IUser } from "@/model/AllModels"
import '../../../../app/globals.css'
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import Link from "next/link"
import transformAttendanceData from "@/lib/transformAttendanceData"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

const localizer = momentLocalizer(moment)
interface AttendanceEvent {
  id: string
  title: string
  start: Date
  end: Date
}

interface LeaveRequest {
  id: string
  type: "SICK" | "UNPAID" | "VACATION"
  subject: string
  status: "REVIEW" | "APPROVED" | "DECLINED"
  startDate: string
  endDate: string
}

export default function EmployeeDetails() {

  const { id } = useParams()
  const [employee, setEmployee] = useState<IUser | null>(null)
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [subordinates, setSubordinates] = useState<IUser[]>([])
  const [isSubordinatesOpen, setIsSubordinatesOpen] = useState(true)

  const { toast } = useToast();

  const singleUserData = useCallback(async () => {
    try {
      const res = await axios.post(`/api/get-single-employee`, { id });
      const fetchedData = res.data.data;

      if (!fetchedData) {
        toast({
          title: "Error",
          description: "Failed to fetch employee data",
          variant: "destructive"
        })
      }
      const transformedData = transformAttendanceData(fetchedData.attendanceData)
      console.log("Transformed data:", transformedData);
      setAttendanceEvents(transformedData);
      setSubordinates(fetchedData.subordinatesList)
      setEmployee(fetchedData.user)
      setLeaveRequests(fetchedData.leaveRequests);
    }
    catch (error) { console.log(error) }
  }, [id, toast])

  useEffect(() => {

    singleUserData();

  }, [id, singleUserData])

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="h-12 w-12 rounded-full bg-zinc-400 inline-flex items-center justify-center">
          <span className="text-xl font-semibold text-black">
            {employee.username.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-semibold mb-4 inline px-4">{employee.username}</h2>
        <div className="pl-16">
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Username:</strong> {employee.username}
          </p>
          <p>
            <strong>Role:</strong> {employee.role}
          </p>
          <Button className="mt-4">
            <Link href={`/employee/${id}/edit`}>Edit Employee</Link>
          </Button>
        </div>
      </div>
      {employee.role === "MANAGER" && subordinates.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Collapsible open={isSubordinatesOpen} onOpenChange={setIsSubordinatesOpen} className="w-full">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-semibold">Subordinates</h2>
              {isSubordinatesOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <ul className="space-y-2">
                {subordinates.map((subordinate, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>
                      {subordinate.username} - {subordinate.role}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/employee/${subordinate._id}`}>View Details</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>)}

        {employee.role === "MANAGER" && subordinates.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Collapsible open={isSubordinatesOpen} onOpenChange={setIsSubordinatesOpen} className="w-full">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-semibold">Subordinates</h2>
              {isSubordinatesOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <ul className="space-y-2">
                <li>No subordinates to display</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>)}
      <h2 className="text-2xl font-bold mb-4">Attendance Calendar</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <Calendar
          localizer={localizer}
          events={attendanceEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date Range</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {leaveRequests.length !== 0 ? (leaveRequests.map((request, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{request.type}</td>
                <td className="py-2 px-4 border-b">{request.subject}</td>
                <td className="py-2 px-4 border-b">{request.status}</td>
                <td className="py-2 px-4 border-b">{`${new Date(request.startDate).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })} to ${new Date(request.endDate).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}`}</td>
              </tr>
            ))) : (
              <tr className="font-semibold text-sm">
                <td colSpan={4} className="py-2 px-4 border-b "> No Leave Requests Made Till Now</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

