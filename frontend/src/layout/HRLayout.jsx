import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const HRLayout = () => {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.post(
            `${API_URL}checkAuth`,
            {},
            {
              withCredentials: true,
            }
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
            case "employee":
              navigate("/employee/home");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
          }
        } catch (error) {
          console.log(error);
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
  
      checkAuth();
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem("isLoggedin");
      navigate("/");
    };
  
    if (loading) {
      return <h1>Loading...</h1>;
    }

  return (
    <div className="flex flex-col min-h-screen w-full font-sans">
      <header className="w-full bg-gradient-to-r from-[#260058] to-[#3e0091] text-white shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide">
                  HR Panel
                </span>
                <span className="text-sm text-purple-200">{user?.username}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/hr/employees"
                className={`relative px-3 py-2 transition-all duration-200 hover:text-purple-200 ${
                  location.pathname === '/hr/employees'
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300 after:rounded-full'
                    : 'text-purple-100'
                }`}
              >
                Employees
              </Link>
              <Link
                to="/hr/add-employee"
                className={`relative px-3 py-2 transition-all duration-200 hover:text-purple-200 ${
                  location.pathname === '/hr/add-employee'
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300 after:rounded-full'
                    : 'text-purple-100'
                }`}
              >
                Add Employee
              </Link>
              <Link
                to="/hr/profile"
                className={`relative px-3 py-2 transition-all duration-200 hover:text-purple-200 ${
                  location.pathname === '/hr/profile'
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300 after:rounded-full'
                    : 'text-purple-100'
                }`}
              >
                Profile
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-medium text-purple-900 bg-white hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
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

export default HRLayout;
