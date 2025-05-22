import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor, icon }) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    purple: "bg-[#260058] hover:bg-[#3e0091] focus:ring-purple-500"
  };

  const buttonColorClass = colorClasses[confirmColor] || colorClasses.purple;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
              confirmColor === 'red' ? 'bg-red-100' : 
              confirmColor === 'green' ? 'bg-green-100' : 
              confirmColor === 'blue' ? 'bg-blue-100' : 
              'bg-purple-100'
            } mb-4`}>
              {icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClass}`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 