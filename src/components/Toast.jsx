import React, { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onClose }) => {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const colors = { 
    success: '#00B894', 
    error: '#FF6B6B', 
    warning: '#FDCB6E', 
    info: '#6C63FF' 
  };

  return (
    <div style={{
      background: '#1a1a2e',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease',
      borderLeft: `4px solid ${colors[toast.type]}`
    }}>
      <span style={{ fontSize: 20 }}>{icons[toast.type]}</span>
      <span style={{ fontSize: 14 }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: 8 }}>✕</button>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
};

export const useToast = () => useContext(ToastContext);