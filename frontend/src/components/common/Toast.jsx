import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${types[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <div className="flex-1">{message}</div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
}