import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Toast { message: string; severity: AlertColor; }
const ToastContext = createContext<(msg: string, severity?: AlertColor) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
    setToast({ message, severity });
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {toast ? <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
};
