"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { IUser } from "@/model/AllModels"

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
  console.log(id)
  const [employee, setEmployee] = useState<IUser | null>(null)
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  const singleUserData = useCallback(async () => {
    try {
      const fetchedData = await axios.post(`/api/get-single-employee`, { id });
      console.log(fetchedData.data?.messages);
      setEmployee(fetchedData.data?.messages);
    }
    catch (error) { console.log(error) }
  }, [id])

  useEffect(() => {
  
    singleUserData();

    // TODO: Fetch actual attendance data from the API
    const mockAttendanceEvents: AttendanceEvent[] = [
      {
        id: "1",
        title: "Present",
        start: new Date(2025, 1, 11, 9, 0),
        end: new Date(2025, 1, 11, 17, 0),
      },
      {
        id: "2",
        title: "Present",
        start: new Date(2025, 1, 12, 9, 30),
        end: new Date(2025, 1, 12, 17, 30),
      },
    ]
    setAttendanceEvents(mockAttendanceEvents)

    // TODO: Fetch actual leave request data from the API
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: "1",
        type: "VACATION",
        subject: "Annual leave",
        status: "APPROVED",
        startDate: "2025-02-15",
        endDate: "2025-02-20",
      },
      {
        id: "2",
        type: "SICK",
        subject: "Flu",
        status: "REVIEW",
        startDate: "2025-03-01",
        endDate: "2025-03-03",
      },
    ]
    setLeaveRequests(mockLeaveRequests)
  }, [id, singleUserData])

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{employee.username}</h2>
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Name:</strong> {employee.username}
        </p>
        <p>
          <strong>Role:</strong> {employee.role}
        </p>
        <Button asChild className="mt-4">
          <Link href={`/employee/${id}/edit`}>Edit Employee</Link>
        </Button>
        
      </div>
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
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b">{request.type}</td>
                <td className="py-2 px-4 border-b">{request.subject}</td>
                <td className="py-2 px-4 border-b">{request.status}</td>
                <td className="py-2 px-4 border-b">{`${request.startDate} to ${request.endDate}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

