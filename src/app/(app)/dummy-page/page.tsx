import React from 'react'

export default function Dummypage() {
  return (
    <>
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Hello, This is page redirected from dashboard when user role is not HR!</h1>
        <p className="text-gray-600">This is a dummy  page.</p>
      </div>
    </main>
  </>
  )
}
