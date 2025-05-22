import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const CustomDropdown = ({ value, onChange, departments }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        className="bg-white rounded-xl shadow-sm p-2 flex items-center gap-3 border border-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="px-3 py-2 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3zm1 0v2.586l4.707 4.707A1 1 0 019 11v4.586l1-1V11a1 1 0 01.293-.707L15 5.586V3H4z" />
          </svg>
        </div>
        <div className="min-w-[200px] px-3 py-2 text-sm text-gray-700 font-medium">
          {value || "All Departments"}
          <svg className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
            <div 
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              All Departments
            </div>
            {departments.map((dept) => (
              <div
                key={dept.dept_id}
                className="px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onChange(dept.dept_name);
                  setIsOpen(false);
                }}
              >
                {dept.dept_name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function HREmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDepartments = async () => {
    try {
      const response = await axios.post(`${API_URL}departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  const fetchAllEmployees = async () => {
    const response = await axios.post(`${API_URL}fetchAllEmployees`);
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchAllEmployees();
    fetchDepartments();
  }, []);

  const handleViewModal = async (employee) => {
    setViewModal(true);
    setSelectedEmployee(employee);
  };

  const filteredEmployees = employees?.filter((employee) => {
    const departmentMatch = selectedDepartment
      ? employee.dept_name === selectedDepartment
      : true;
    const statusMatch = statusFilter === "all" 
      ? true 
      : employee.status === statusFilter;
    const searchMatch = searchQuery.trim() === "" 
      ? true 
      : employee.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.dept_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return departmentMatch && statusMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            
            {/* Search Bar */}
            <div className="w-72">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#260058]"
                />
              </div>
            </div>
          </div>

          {/* Department Filter UI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Filter by Department:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDepartment("")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDepartment === ""
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {departments.map((dept) => (
                    <button
                      key={dept.dept_id}
                      onClick={() => setSelectedDepartment(dept.dept_name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDepartment === dept.dept_name
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {dept.dept_name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>
                  Showing: <span className="font-medium text-gray-900">
                    {filteredEmployees.length}
                  </span> employees
                </span>
              </div>
            </div>
          </div>

          {/* Status Filter UI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Filter by Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "active"
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("disabled")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === "disabled"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Avatar</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Username</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Department</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Created At</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Status</span>
                    </div>
                  </th>
                  <th className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <span className="text-base font-bold text-gray-800">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.user_id} 
                      className={`hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        employee.status === 'disabled' ? 'bg-gray-50' : ''
                      }`}>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        {employee.avatar ? (
                          <div className="relative group">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 transform hover:scale-105">
                              <img
                                src={`data:image/jpeg;base64,${employee.avatar}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg border-2 border-gray-200">
                            {employee.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-gray-800">{employee.username}</span>
                        <span className="text-sm text-gray-500">Employee</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {employee?.dept_name || "No Department"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{new Date(employee.created_at).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">{new Date(employee.created_at).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        employee.status === 'active' 
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {employee.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          onClick={() => handleViewModal(employee)}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          viewModal ? "" : "hidden"
        }`}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setViewModal(false)}
          aria-hidden="true"
        />
        <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Employee Details</h3>
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex justify-center">
                <div className="w-28 h-28 rounded-full border-4 border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {selectedEmployee?.avatar ? (
                    <img
                      src={`data:image/jpeg;base64,${selectedEmployee?.avatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">no avatar</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                value={selectedEmployee?.username || ""}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                value={selectedEmployee?.dept_name || "Not Assigned"}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <div className={`w-full px-4 py-2 text-sm rounded-lg ${
                selectedEmployee?.status === 'active'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {selectedEmployee?.status === 'active' ? 'Active' : 'Disabled'}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HREmployeeList;
