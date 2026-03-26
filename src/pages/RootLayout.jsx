import Navbar from '@/components/Navbar'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div>
        <Toaster />
        <Navbar />
        <Outlet />
    </div>
  )
}

export default RootLayout