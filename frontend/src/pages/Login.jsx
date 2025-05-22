import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsDisabled(false);

    try {
      const response = await axios.post(
        `${API_URL}loginUser`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.type === "success") {
        const user = response.data.user;

        localStorage.setItem("isLoggedin", true);

        switch (user?.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "hr":
            navigate("/hr/employees");
            break;
          case "employee":
            navigate("/employee/home");
            break;
          default:
            navigate("/");
        }
      } else {
        if (response.data.message.includes('disabled')) {
          setIsDisabled(true);
        }
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Welcome Back</h2>

        {error && (
          <div className={`mb-6 px-4 py-3 ${isDisabled ? 'bg-orange-50 border border-orange-100 text-orange-700' : 'bg-red-50 border border-red-100 text-red-600'} text-sm rounded-xl`}>
            <div className="flex items-center justify-center gap-2">
              {isDisabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#260058] focus:border-transparent transition-colors"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#260058] focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#260058] hover:bg-[#3e0091] text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 EMSYSTEM
        </p>
      </div>
    </div>
  );
};

export default Login;
