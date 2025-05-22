import axios from "axios";
import React, { useEffect, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

function AdminEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    confirmColor: "",
    icon: null,
    onConfirm: () => {},
  });

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

  const handleDelete = async (user_id, currentStatus) => {
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    
    setConfirmationModal({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} this user? ${currentStatus === 'active' ? 'They will no longer be able to access the system.' : 'They will regain access to the system.'}`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      confirmColor: currentStatus === 'active' ? 'red' : 'green',
      icon: currentStatus === 'active' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `${API_URL}removeEmployee`,
            {
              user_id: user_id,
              action: action
            },
            { withCredentials: true }
          );

          if (response.data.type === "success") {
            alert(response.data.message);
            fetchAllEmployees();
          } else {
            alert(response.data.message);
            fetchAllEmployees();
          }
        } catch (error) {
          console.error(`Error ${action}ing employee:`, error);
          alert(`Failed to ${action} employee`);
        }
      },
    });
  };

  const handleEditModal = async (employee) => {
    setConfirmationModal({
      isOpen: true,
      title: "Edit Employee",
      message: "Do you want to edit this employee's information?",
      confirmText: "Edit",
      confirmColor: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onConfirm: () => {
        setEditModal(true);
        setSelectedEmployee(employee);
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedEmployee((prev) => ({
          ...prev,
          avatar: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();

    await axios.post(
      `${API_URL}updateEmployee`,
      {
        user_id: selectedEmployee.user_id,
        avatar: selectedEmployee.avatar,
        username: selectedEmployee.username,
        newPass: selectedEmployee.password,
        dept_id: selectedEmployee.dept_id,
      },
      { withCredentials: true }
    );

    setEditModal(false);
    fetchAllEmployees();
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

          {/* New Filter UI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mt-4">
            <div className="flex items-center justify-between">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
                        {employee.status === 'active' && (
                          <button
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            onClick={() => handleEditModal(employee)}
                          >
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </div>
                          </button>
                        )}
                        <button
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            employee.status === 'active'
                              ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100'
                              : 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100'
                          }`}
                          onClick={() => handleDelete(employee.user_id, employee.status)}
                        >
                          <div className="flex items-center gap-2">
                            {employee.status === 'active' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Disable
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Enable
                              </>
                            )}
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

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          editModal ? "" : "hidden"
        }`}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setEditModal(false)}
          aria-hidden="true"
        />
        <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Employee</h3>
          <form onSubmit={(e) => handleEditEmployee(e)} className="space-y-6">
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Update Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#260058] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={selectedEmployee?.username}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#260058]"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={selectedEmployee?.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#260058]"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Current: <span className="font-medium text-gray-900">{departments.find((d) => d.dept_name === selectedEmployee?.dept_name)?.dept_name || "Not Assigned"}</span>
              </p>
              <select
                id="department"
                name="dept_id"
                value={selectedEmployee?.dept_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#260058] bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#260058] hover:bg-[#3e0091] rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
      />
    </div>
  );
}

export default AdminEmployeeList;
