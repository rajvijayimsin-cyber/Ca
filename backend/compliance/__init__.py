"""
Compliance modules for this project.
Auto-generated based on selected standards.
"""

from .security_headers import SecurityHeadersMiddleware
from .rate_limiter import setup_rate_limiting
from .csrf_protection import CSRFMiddleware
from .input_sanitizer import sanitize_input, InputSanitizer
from .auth_config import pwd_context, verify_password, hash_password
from .mfa_utils import TOTPManager
from .hipaa_audit import AuditLog, HIPAAAuditMiddleware
from .encryption import encrypt_phi, decrypt_phi
from .hipaa_rbac import ROLE_PERMISSIONS, require_role, require_permission, check_permission
from .hipaa_session import check_session_timeout, touch_session, expire_session, SESSION_TIMEOUT
from .hipaa_password import validate_password_strength, check_password_expiry, clear_failed_attempts
from .hipaa_phi_fields import EncryptedString, PHI_FIELD_NAMES
from .phi_disclosures import PHIDisclosureLog, log_phi_access
from .emergency_access import EmergencyAccessLog, break_glass_access
from . import hipaa_breach
from .rbac_middleware import HIPAARoleEnforcementMiddleware
from .orm_hooks import register_phi_hooks, mark_phi_model

__all__ = [
    "SecurityHeadersMiddleware",
    "setup_rate_limiting",
    "CSRFMiddleware",
    "sanitize_input",
    "InputSanitizer",
    "pwd_context",
    "verify_password",
    "hash_password",
    "TOTPManager",
    "AuditLog",
    "HIPAAAuditMiddleware",
    "encrypt_phi",
    "decrypt_phi",
    "ROLE_PERMISSIONS",
    "require_role",
    "require_permission",
    "check_permission",
    "check_session_timeout",
    "touch_session",
    "expire_session",
    "SESSION_TIMEOUT",
    "validate_password_strength",
    "check_password_expiry",
    "clear_failed_attempts",
    "EncryptedString",
    "PHI_FIELD_NAMES",
    "PHIDisclosureLog",
    "log_phi_access",
    "EmergencyAccessLog",
    "break_glass_access",
    "hipaa_breach",
    "HIPAARoleEnforcementMiddleware",
    "register_phi_hooks",
    "mark_phi_model",
    "setup_compliance",
]


def setup_compliance(app, standards=None):
    """Register compliance middleware and routers on the FastAPI app.
    Call from main.py once, right after app creation.
    Standards may be a list like ['hipaa', 'gdpr'] or None (reads COMPLIANCE_STANDARDS env var).
    Fail-open: exceptions are logged but never crash app startup.
    Populates app.state.compliance_status for runtime verification via
    GET /api/compliance-status."""
    import logging
    import os
    log = logging.getLogger(__name__)
    if standards is None:
        standards = os.getenv("COMPLIANCE_STANDARDS", "").split(",")
    active = {s.strip().lower() for s in (standards or []) if s and s.strip()}

    # Track what we successfully register — exposed via /api/compliance-status
    status = {
        "active_standards": sorted(active),
        "middleware": {},
        "routers": {},
        "encryption": {},
    }

    # Security baseline — always registered
    try:
        app.add_middleware(SecurityHeadersMiddleware)
        status["middleware"]["SecurityHeadersMiddleware"] = True
        log.info('compliance: SecurityHeadersMiddleware registered')
    except Exception as e:
        status["middleware"]["SecurityHeadersMiddleware"] = False
        log.warning('compliance: SecurityHeadersMiddleware skipped: %s', e)
    try:
        setup_rate_limiting(app)
        status["middleware"]["rate_limiting"] = True
        log.info('compliance: rate limiting registered')
    except Exception as e:
        status["middleware"]["rate_limiting"] = False
        log.warning('compliance: rate limiting skipped: %s', e)

    if 'hipaa' in active:
        try:
            app.add_middleware(HIPAAAuditMiddleware)
            status["middleware"]["HIPAAAuditMiddleware"] = True
            log.info('compliance: HIPAAAuditMiddleware registered')
        except Exception as e:
            status["middleware"]["HIPAAAuditMiddleware"] = False
            log.warning('compliance: HIPAAAuditMiddleware skipped: %s', e)
        try:
            app.add_middleware(HIPAARoleEnforcementMiddleware)
            status["middleware"]["HIPAARoleEnforcementMiddleware"] = True
            log.info('compliance: HIPAARoleEnforcementMiddleware registered')
        except Exception as e:
            status["middleware"]["HIPAARoleEnforcementMiddleware"] = False
            log.warning('compliance: HIPAARoleEnforcementMiddleware skipped: %s', e)
        # Probe encryption key presence (without exposing the key)
        try:
            import os as _os
            from .encryption import _cipher  # noqa
            status["encryption"]["key_initialized"] = _cipher is not None
            status["encryption"]["key_source"] = "env" if _os.getenv("ENCRYPTION_KEY") else "ephemeral"
        except Exception as e:
            status["encryption"]["key_initialized"] = False
            status["encryption"]["error"] = str(e)[:120]


    # Expose status for runtime verification
    try:
        app.state.compliance_status = status
    except Exception:
        pass

    # Mount /api/compliance-status endpoint (read-only, no auth)
    try:
        from fastapi import APIRouter
        _cs_router = APIRouter()

        @_cs_router.get("/api/compliance-status", tags=["compliance"])
        def _compliance_status():
            return status

        app.include_router(_cs_router)
        log.info('compliance: /api/compliance-status endpoint registered')
    except Exception as e:
        log.warning('compliance: status endpoint skipped: %s', e)

    return active
