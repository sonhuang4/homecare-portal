import React, { useEffect } from 'react';
import { useToast } from '../../Context/ToastContext';

const Toast = ({ toast }) => {
    const { removeToast } = useToast();

    const getToastStyles = (type) => {
        const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 w-[550px]";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white border-l-4 border-green-700`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white border-l-4 border-red-700`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-700`;
            case 'info':
            default:
                return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-700`;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={getToastStyles(toast.type)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2 text-lg">{getIcon(toast.type)}</span>
                    <p className="font-medium">{toast.message}</p>
                </div>
                <button
                    onClick={() => removeToast(toast.id)}
                    className="ml-4 text-white hover:text-gray-200 font-bold text-xl"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ 
                        transform: `translateY(${index * 80}px)`,
                        zIndex: 9999 - index 
                    }}
                >
                    <Toast toast={toast} />
                </div>
            ))}
        </div>
    );
};

export default Toast;