/**
 * Session Timeout Component
 * HIPAA automatic logoff - monitors inactivity and triggers auto-logout.
 * Default timeout: 15 minutes with session expiration warning.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ timeoutMinutes = 15, warningMinutes = 2, onTimeout }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimeout = useCallback(() => {
    setShowWarning(false);
    if (onTimeout) { onTimeout(); } else {
      sessionStorage.clear();
      window.location.href = "/login?reason=session_timeout";
    }
  }, [onTimeout]);

  const resetTimers = useCallback(() => {
    setShowWarning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
    const totalMs = timeoutMinutes * 60 * 1000;
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(warningMinutes * 60);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => { if (prev <= 1) { if (countdownRef.current) clearInterval(countdownRef.current); return 0; } return prev - 1; });
      }, 1000);
    }, warningMs);
    timerRef.current = setTimeout(handleTimeout, totalMs);
  }, [timeoutMinutes, warningMinutes, handleTimeout]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => { if (!showWarning) resetTimers(); };
    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetTimers();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [resetTimers, showWarning]);

  if (!showWarning) return null;
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
      <div style={{ background: "#fff", padding: 30, borderRadius: 8, maxWidth: 400, textAlign: "center" }}>
        <h3>Session Timeout Warning</h3>
        <p>Your session will expire due to inactivity in <strong>{minutes}:{seconds.toString().padStart(2, "0")}</strong></p>
        <button onClick={resetTimers} style={{ padding: "10px 24px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", marginRight: 10 }}>Stay Logged In</button>
        <button onClick={handleTimeout} style={{ padding: "10px 24px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Logout Now</button>
      </div>
    </div>
  );
};

export default SessionTimeout;
