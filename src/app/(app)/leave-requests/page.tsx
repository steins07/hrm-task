"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface LeaveRequest {
  id: string
  userId: string
  userName: string
  type: "SICK" | "UNPAID" | "VACATION"
  subject: string
  status: "REVIEW" | "APPROVED" | "DECLINED"
  startDate: string
  endDate: string
}

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  useEffect(() => {
    // TODO: Fetch actual leave request data from the API
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: "1",
        userId: "1",
        userName: "John Doe",
        type: "VACATION",
        subject: "Annual leave",
        status: "REVIEW",
        startDate: "2025-02-15",
        endDate: "2025-02-20",
      },
      {
        id: "2",
        userId: "2",
        userName: "Jane Smith",
        type: "SICK",
        subject: "Flu",
        status: "APPROVED",
        startDate: "2025-02-12",
        endDate: "2025-02-14",
      },
    ]
    setLeaveRequests(mockLeaveRequests)
  }, [])

  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "DECLINED" | "REVIEW") => {
    // TODO: Implement API call to update leave request status
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)),
      )

      alert(`Leave request ${id} has been ${newStatus.toLowerCase()}.`)
    } catch (error) {
      console.error("Error updating leave request status:", error)
      alert("Failed to update leave request status. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leave Requests</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Employee</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Subject</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Date Range</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td className="py-2 px-4 border-b">
                <Link href={`/employee/${request.userId}`} className="text-blue-600 hover:underline">
                  {request.userName}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">{request.type}</td>
              <td className="py-2 px-4 border-b">{request.subject}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">{`${request.startDate} to ${request.endDate}`}</td>
              <td className="py-2 px-4 border-b">
                {request.status !== "APPROVED" && (
                  <button
                    onClick={() => handleStatusChange(request.id, "APPROVED")}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                )}
                {request.status !== "DECLINED" && (
                  <button
                    onClick={() => handleStatusChange(request.id, "DECLINED")}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Decline
                  </button>
                )}
                {request.status !== "REVIEW" && (
                  <button
                    onClick={() => handleStatusChange(request.id, "REVIEW")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Reset to Review
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

