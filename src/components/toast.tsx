import React, { useState } from 'react';

export interface ToastProps {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Call this function to add a new toast
  function addToast(message: string, type: ToastProps['type'] = 'info') {
    const id = Date.now(); // simple unique id; can use uuid or counter too
    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      {toasts.map(({ id, message, type }) => (
        <Toast key={id} message={message} type={type} />
      ))}

      {/* Example button to test */}
      <button onClick={() => addToast('Hello Toast!', 'success')}>
        Show Toast
      </button>
    </div>
  );
}

export function Toast({ message, type = 'info' }: { message: string; type?: string }) {
  const backgroundColors = {
    info: '#2196f3',
    success: '#4caf50',
    error: '#f44336',
  };

  const backgroundType = (type === 'info' || type === 'success' || type === 'error') 
    ? backgroundColors[type]
    : null;

  return (
    <div
      style={{
        backgroundColor: backgroundType || '#333',
        color: '#fff',
        marginBottom: 8,
        padding: '20px 20px',
        borderRadius: 4,
        boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
        minWidth: 200,
      }}
    >
      {message}
    </div>
  );
}