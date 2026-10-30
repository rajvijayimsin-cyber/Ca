"""HIPAA Breach Detection & Monitoring — § 164.308(a)(6)."""
import logging
from datetime import datetime, timedelta
from typing import Dict, List

logger = logging.getLogger(__name__)

BREACH_ALERT_THRESHOLD = 10  # failed logins per hour
OFF_HOURS_START = 22  # 10 PM
OFF_HOURS_END = 6  # 6 AM

_login_failures: Dict[str, List[datetime]] = {}


def record_failed_login(user_id: str, ip_address: str = "") -> dict:
    """Record failed login and check for breach indicators."""
    now = datetime.utcnow()
    key = f"{user_id}:{ip_address}"
    if key not in _login_failures:
        _login_failures[key] = []
    _login_failures[key].append(now)
    # Clean old entries
    cutoff = now - timedelta(hours=1)
    _login_failures[key] = [t for t in _login_failures[key] if t > cutoff]
    recent = len(_login_failures[key])
    alert = recent >= BREACH_ALERT_THRESHOLD
    if alert:
        logger.critical("BREACH_ALERT: %d failed logins for %s in 1h", recent, key)
    return {"alert": alert, "failed_count": recent, "threshold": BREACH_ALERT_THRESHOLD}


def check_off_hours_access(user_id: str) -> bool:
    """Return True if current access is during off-hours."""
    hour = datetime.utcnow().hour
    is_off_hours = hour >= OFF_HOURS_START or hour < OFF_HOURS_END
    if is_off_hours:
        logger.warning("Off-hours access by %s at %02d:00 UTC", user_id, hour)
    return is_off_hours
