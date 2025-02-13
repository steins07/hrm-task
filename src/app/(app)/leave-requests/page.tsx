"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import IApiResponse from "@/types/ApiResponse"
interface LeaveRequest {
  _id: string
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
  const { toast } = useToast();

  const allLeaveRequest = useCallback(async () => {
    try {
      const res = await axios.get("/api/get-leave-request");
      if (!res.data) {
        setLeaveRequests([]);
        toast({
          title: "No Leave Request",
          description: "No leave request found or applied",
          variant: "default"
        })
      }
      console.log("this is leave:", res.data.messages)
      setLeaveRequests(res.data.messages);
      toast({
        title: "Success",
        description: "Leave request fetched successfully",
        variant: "default"
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    allLeaveRequest();
  }, [allLeaveRequest])

  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "DECLINED" | "REVIEW") => {
    try {
      console.log(id, newStatus)
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) => (request?._id === id ? { ...request, status: newStatus } : request)),
      )
      const response = await axios.post(`/api/update-request`, { id, status: newStatus });
      if(response.data.success===true){
        console.log(response.data.messages)
        toast({
          title: "Success",
          description: response.data.messages,
          variant: "default"
        })
      }
    } catch (error) {
      console.error("Error updating leave request status:", error)
      const axiosError = error as AxiosError<IApiResponse>
      toast({
        title: "Failed",
        description: axiosError.response?.data.messages,
        variant: "destructive"
      })
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
          {leaveRequests.map((request, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">
                <Link href={`/employee/${request.userId}`} className="text-blue-600 hover:underline">
                  {request.userId}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">{request.type}</td>
              <td className="py-2 px-4 border-b">{request.subject}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">{`
              ${new Date(request.startDate).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })} 
              to ${new Date(request.endDate).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}`}</td>
              <td className="py-2 px-4 border-b">
                {request.status !== "APPROVED" && (
                  <button
                    onClick={() => handleStatusChange(request._id, "APPROVED")}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                )}
                {request.status !== "DECLINED" && (
                  <button
                    onClick={() => handleStatusChange(request._id, "DECLINED")}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Decline
                  </button>
                )}
                {request.status !== "REVIEW" && (
                  <button
                    onClick={() => handleStatusChange(request._id, "REVIEW")}
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

