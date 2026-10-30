"""HIPAA Path-Pattern RBAC Middleware — § 164.312(a)(1) Access Control.
Default-deny: any request to a PHI path without the right role is rejected.
This catches AI-generated routers that forgot to add @require_role decorators.
"""
import os
import re
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)

# Paths that unconditionally require a clinical role.
# Override via env var PHI_PATH_PREFIXES (comma-separated).
DEFAULT_PHI_PREFIXES = [
    "/api/patients", "/api/patient/",
    "/api/medical-records", "/api/medical/",
    "/api/labs", "/api/lab-results", "/api/lab/",
    "/api/prescriptions", "/api/prescription/",
    "/api/diagnoses", "/api/diagnosis/",
    "/api/ehr/", "/api/phi/",
]
ALLOWLIST_PREFIXES = ["/health", "/docs", "/openapi.json", "/api/auth", "/api/compliance-status"]

CLINICAL_ROLES = {"doctor", "nurse", "admin", "clinician"}


def _matches_any(path: str, prefixes) -> bool:
    return any(path.startswith(p) for p in prefixes)


class HIPAARoleEnforcementMiddleware(BaseHTTPMiddleware):
    """Default-deny RBAC by URL pattern. Runs after auth middleware."""

    def __init__(self, app, phi_prefixes=None, allowlist=None):
        super().__init__(app)
        _env = os.getenv('PHI_PATH_PREFIXES', '')
        self.phi_prefixes = phi_prefixes or (
            [p.strip() for p in _env.split(',') if p.strip()]
            if _env else DEFAULT_PHI_PREFIXES
        )
        self.allowlist = allowlist or ALLOWLIST_PREFIXES

    async def dispatch(self, request, call_next):
        path = request.url.path
        # Allowlist first
        if _matches_any(path, self.allowlist):
            return await call_next(request)
        # Not a PHI path → pass through
        if not _matches_any(path, self.phi_prefixes):
            return await call_next(request)
        # PHI path — require authenticated user with clinical role
        user = getattr(request.state, 'user', None)
        if not user:
            logger.info('RBAC: unauthenticated access to PHI path %s', path)
            return JSONResponse({'detail': 'Authentication required'}, status_code=401)
        role = getattr(user, 'role', '') or (user.get('role', '') if isinstance(user, dict) else '')
        if role not in CLINICAL_ROLES:
            logger.info('RBAC: role %r denied PHI path %s', role, path)
            return JSONResponse({'detail': 'Insufficient permissions (HIPAA RBAC)'}, status_code=403)
        return await call_next(request)
