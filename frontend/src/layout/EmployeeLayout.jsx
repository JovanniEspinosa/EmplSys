import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const EmployeeLayout = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${API_URL}checkAuth`,
          {},
          { withCredentials: true }
        );

        if (response.data.type !== "success") {
          localStorage.removeItem("isLoggedin");
          navigate("/");
        } else {
            const response = await axios.post(
                `${API_URL}fetchUserDetails`,
                {},
                { withCredentials: true }
              );
        
              setUser(response.data.user);
        }

        switch (response.data.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "hr":
            navigate("/hr/employees");
            break;
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await axios.post(`${API_URL}logoutUser`, {}, { withCredentials: true });

    localStorage.removeItem("isLoggedin");
    navigate("/");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full font-sans">
      <header className="w-full bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 bg-gray-100 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 font-bold text-lg overflow-hidden border-2 border-gray-200 shadow-lg transition-transform hover:scale-105">
                {user?.avatar ? (
                  <img
                    src={`data:image/jpeg;base64,${user?.avatar}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 tracking-wide">
                  Employee Panel
                </span>
                <span className="text-xs text-gray-500">{user?.username}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                to="/employee/home"
                className="relative px-3 py-2 transition-all duration-200 hover:text-gray-900 group"
              >
                Home
                {location.pathname === '/employee/home' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/employee/profile"
                className="relative px-3 py-2 transition-all duration-200 hover:text-gray-900 group"
              >
                Profile
                {location.pathname === '/employee/profile' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full"></span>
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full p-6">
        <Outlet context={{ user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeLayout;
