import DashboardLayout from '@/components/partials/DashboardLayout'
import React from 'react'

const NotFoundPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          404 Not Found
        </h1>
        <p className="text-gray-600 text-sm">
          The page you're looking for does not exist
        </p>
      </div>
    </DashboardLayout>
  );
}

export default NotFoundPage