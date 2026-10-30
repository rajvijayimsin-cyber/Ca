"""HIPAA Session Management — § 164.312(a)(2)(iii) Automatic Logoff."""
import time
from typing import Dict, Optional

SESSION_TIMEOUT = 900  # 15 minutes per HIPAA recommendation
MAX_CONCURRENT_SESSIONS = 3

_sessions: Dict[str, dict] = {}  # user_id -> {last_active, session_ids}


def check_session_timeout(user_id: str) -> bool:
    """Return True if session is still valid, False if auto-logoff needed."""
    session = _sessions.get(user_id)
    if not session:
        return False
    elapsed = time.time() - session["last_active"]
    if elapsed > SESSION_TIMEOUT:
        expire_session(user_id)
        return False
    return True


def touch_session(user_id: str, session_id: str = "default") -> None:
    """Update last activity timestamp."""
    if user_id not in _sessions:
        _sessions[user_id] = {"last_active": time.time(), "session_ids": set()}
    _sessions[user_id]["last_active"] = time.time()
    _sessions[user_id]["session_ids"].add(session_id)
    # Enforce concurrent session limit
    if len(_sessions[user_id]["session_ids"]) > MAX_CONCURRENT_SESSIONS:
        oldest = list(_sessions[user_id]["session_ids"])[0]
        _sessions[user_id]["session_ids"].discard(oldest)


def expire_session(user_id: str) -> None:
    """Force session expiration (auto-logoff)."""
    _sessions.pop(user_id, None)
