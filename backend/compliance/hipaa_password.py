"""HIPAA Password Policy — § 164.312(d) Authentication Strength."""
import re
from datetime import datetime, timedelta
from typing import Dict, Tuple

PASSWORD_EXPIRY_DAYS = 90
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 30

_failed_attempts: Dict[str, dict] = {}  # user_id -> {count, locked_until}


def validate_password_strength(password: str) -> Tuple[bool, str]:
    """Validate password meets HIPAA complexity requirements."""
    if len(password) < 8:
        return False, "Minimum 8 characters"
    if not re.search(r"[A-Z]", password):
        return False, "Requires uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Requires lowercase letter"
    if not re.search(r"[0-9]", password):
        return False, "Requires digit"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Requires special character"
    return True, "OK"


def check_password_expiry(last_changed: datetime) -> bool:
    """Return True if password is expired."""
    return datetime.utcnow() - last_changed > timedelta(days=PASSWORD_EXPIRY_DAYS)


def record_failed_login(user_id: str) -> bool:
    """Record failed login. Returns True if account is now locked (lockout)."""
    now = datetime.utcnow()
    entry = _failed_attempts.get(user_id, {"count": 0, "locked_until": None})
    if entry["locked_until"] and now < entry["locked_until"]:
        return True
    entry["count"] += 1
    if entry["count"] >= MAX_FAILED_ATTEMPTS:
        entry["locked_until"] = now + timedelta(minutes=LOCKOUT_MINUTES)
        _failed_attempts[user_id] = entry
        return True
    _failed_attempts[user_id] = entry
    return False


def clear_failed_attempts(user_id: str) -> None:
    _failed_attempts.pop(user_id, None)
