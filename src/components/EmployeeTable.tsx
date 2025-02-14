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
import { Button } from "@/components/ui/button"
import { IUser } from "@/model/AllModels"
import Link from "next/link"

interface IEmployeeTableProps {
    currentEmployees: IUser[];
    handleDeleteEmployee: (id: string) => void
}

export default function EmployeeTable({currentEmployees,handleDeleteEmployee}:IEmployeeTableProps) {
  return (
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
        </table>
  )
}
