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

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 6000);
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
    info: '#5197cf69',
    success: '#78d17f69',
    error: '#db7a7569',
  };

  const backgroundType = (type === 'info' || type === 'success' || type === 'error') 
    ? backgroundColors[type]
    : '#333a'; // fallback with alpha

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 8,
        borderRadius: 4,
        minWidth: 200,
        boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: backgroundType,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: '20px 20px',
          zIndex: 1,
          fontSize: '1rem',
          color: '#f0f0f0',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        }}
      >
        {message}
      </div>
    </div>
  );
}