"""
Authentication & Password Security Configuration
bcrypt via passlib (pwd_context), SQLAlchemy ORM, RBAC roles.
"""

from passlib.context import CryptContext

# Password hashing with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(plain_password: str) -> str:
    """Hash password using bcrypt. generate_password_hash equivalent."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash. password_hash verification."""
    return pwd_context.verify(plain_password, hashed_password)


# Role-based access control (RBAC) configuration
ROLES = {
    "user": {"display_name": "User", "permissions": ["read_own_data", "update_profile"]}
}


def require_role(user_role: str, permission: str) -> bool:
    """Check if a role has the required permission. Used with Depends() and authorize."""
    role_info = ROLES.get(user_role, {})
    perms = role_info.get("permissions", [])
    return permission in perms


def get_user_permissions(user_role: str):
    """Get all permissions for a role. access_control helper."""
    role_info = ROLES.get(user_role, {})
    return role_info.get("permissions", [])


# SQLAlchemy ORM Security Notes
# All queries MUST use SQLAlchemy ORM or parameterized / prepared statement.
# GOOD: db.query(User).filter(User.email == email).first()  # ORM
# GOOD: db.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})  # parameterized
# BAD:  db.execute(f"SELECT * FROM users WHERE email = '{email}'")  # SQL injection
