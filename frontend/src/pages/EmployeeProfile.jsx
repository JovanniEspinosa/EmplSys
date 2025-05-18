import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

function EmployeeProfile() {
  const { user, setUser } = useOutletContext();
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          avatar: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      await axios.post(
        `${API_URL}updateAvatar`,
        {
          avatar: user.avatar,
        },
        {
          withCredentials: true,
        }
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update avatar", error);
    }
  };

  return (
    <div className="min-h-screen to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-slate-100">
                    {user?.avatar ? (
                      <img
                        src={`data:image/jpeg;base64,${user?.avatar}`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <span className="text-5xl font-bold text-slate-100">
                          {user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                  >
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                
                <h1 className="mt-6 text-2xl font-bold text-slate-900">{user?.username}</h1>
                <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-700/10 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Account Details Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">User ID</div>
                    <div className="text-base font-semibold text-slate-900 bg-slate-50 rounded-xl px-4 py-3">
                      {user?.user_id}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">Account Created</div>
                    <div className="text-base font-semibold text-slate-900 bg-slate-50 rounded-xl px-4 py-3">
                      {new Date(user?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Stats Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Activity Stats
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">12</div>
                    <div className="text-sm text-slate-500 mt-1">Total Actions</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">5</div>
                    <div className="text-sm text-slate-500 mt-1">This Week</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">3</div>
                    <div className="text-sm text-slate-500 mt-1">Today</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">85%</div>
                    <div className="text-sm text-slate-500 mt-1">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Update Profile Picture</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-3xl bg-slate-50 ring-4 ring-slate-100 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={`data:image/jpeg;base64,${user?.avatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-slate-300">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Choose new picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 text-sm text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 active:transform active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAvatarUpdate}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeProfile;
