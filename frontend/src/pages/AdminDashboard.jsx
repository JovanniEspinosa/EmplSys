import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const DashboardCard = ({ cardTitle, description }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg group border border-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {cardTitle === "Employees" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {cardTitle === "Admins" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {cardTitle === "HR's" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          <h2 className="text-base font-semibold text-gray-600">{cardTitle}</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-gray-900">{description}</p>
          <span className="text-sm font-medium text-gray-500">users</span>
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const [employeesCount, setEmployeesCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [HRCount, setHRCount] = useState(0);

  useEffect(() => {
    const getAllUsersCount = async () => {
      const response = await axios(`${API_URL}getAllUsersCount`);

      setAdminCount(response.data[0].totalCount);
      setHRCount(response.data[1].totalCount);
      setEmployeesCount(response.data[2].totalCount);
    };

    getAllUsersCount();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">Real-time overview of system users and role distribution</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard cardTitle="Employees" description={employeesCount} />
        <DashboardCard cardTitle="Admins" description={adminCount} />
        <DashboardCard cardTitle="HR's" description={HRCount} />
      </div>
    </div>
  );
}

export default Dashboard;
