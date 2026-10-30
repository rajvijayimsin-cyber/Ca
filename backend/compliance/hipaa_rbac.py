"""HIPAA Role-Based Access Control — § 164.312(a)(1)."""
from functools import wraps
from fastapi import HTTPException, status

ROLE_PERMISSIONS = {
    "admin": ["read", "write", "delete", "manage_users", "audit", "emergency_access"],
    "doctor": ["read", "write", "prescribe", "view_phi"],
    "nurse": ["read", "write", "view_phi"],
    "receptionist": ["read", "schedule"],
    "patient": ["read_own", "update_own"],
}


def require_role(*allowed_roles):
    """Decorator to enforce role-based access."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user=None, **kwargs):
            if not current_user or getattr(current_user, "role", "patient") not in allowed_roles:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator


def require_permission(permission: str):
    """Decorator to enforce specific permission."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user=None, **kwargs):
            role = getattr(current_user, "role", "patient")
            perms = ROLE_PERMISSIONS.get(role, [])
            if permission not in perms:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Missing permission: {permission}")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator


def check_permission(user, permission: str) -> bool:
    """Check if user has a specific permission."""
    role = getattr(user, "role", "patient")
    return permission in ROLE_PERMISSIONS.get(role, [])
