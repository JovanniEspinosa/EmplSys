import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const LINKS = [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
  },
  {
    path: "/admin/employees",
    name: "Employees",
  },
  {
    path: "/admin/users",
    name: "All Users",
  },
  {
    path: "/admin/add-user",
    name: "Add User",
  },
  {
    path: "/admin/logs",
    name: "Activity Logs",
  },
  {
    path: "/admin/profile",
    name: "Profile",
  },
];

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

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
          case "hr":
            navigate("/hr/employees");
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide">
                  Admin Panel
                </span>
                <span className="text-sm text-purple-200">{user?.username}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {LINKS.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`relative px-3 py-2 transition-all duration-200 hover:text-purple-200 ${
                    location.pathname === link.path 
                      ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300 after:rounded-full' 
                      : 'text-purple-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
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

export default AdminLayout;
