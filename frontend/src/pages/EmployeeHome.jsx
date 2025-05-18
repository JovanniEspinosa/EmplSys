import React from 'react';
import { useOutletContext } from 'react-router-dom';

function EmployeeHome() {
  const { user } = useOutletContext();

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Access your workspace tools and information below
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time Clock */}
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Time Clock</h3>
              <p className="text-sm text-gray-500">Check in or out</p>
            </div>
          </button>

          {/* View Schedule */}
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule</h3>
              <p className="text-sm text-gray-500">View your timetable</p>
            </div>
          </button>

          {/* Submit Request */}
          <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Requests</h3>
              <p className="text-sm text-gray-500">Submit a request</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeHome;
