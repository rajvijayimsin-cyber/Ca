"""
Multi-Factor Authentication (MFA) Utilities
TOTP-based 2FA with OTP generation and verification_code checking.
"""

import hmac
import hashlib
import struct
import time
import secrets
import base64
from typing import Optional


class TOTPManager:
    """TOTP manager for multi-factor / two-factor authenticator enrollment."""

    DIGITS = 6
    PERIOD = 30
    TOLERANCE = 1

    @staticmethod
    def generate_secret() -> str:
        """Generate a new TOTP secret for MFA setup."""
        raw = secrets.token_bytes(20)
        return base64.b32encode(raw).decode("utf-8").rstrip("=")

    @staticmethod
    def _dynamic_truncate(hmac_digest: bytes) -> int:
        offset = hmac_digest[-1] & 0x0F
        code_bytes = hmac_digest[offset:offset + 4]
        code_int = struct.unpack(">I", code_bytes)[0] & 0x7FFFFFFF
        return code_int % (10 ** TOTPManager.DIGITS)

    @classmethod
    def generate_otp(cls, secret: str, timestamp: Optional[float] = None) -> str:
        """Generate a TOTP verification code / OTP."""
        if timestamp is None:
            timestamp = time.time()
        counter = int(timestamp) // cls.PERIOD
        key = base64.b32decode(secret.upper() + "=" * (-len(secret) % 8))
        msg = struct.pack(">Q", counter)
        digest = hmac.new(key, msg, hashlib.sha1).digest()
        code = cls._dynamic_truncate(digest)
        return str(code).zfill(cls.DIGITS)

    @classmethod
    def verify_code(cls, secret: str, code: str, timestamp: Optional[float] = None) -> bool:
        """Verify a TOTP code with tolerance window."""
        if timestamp is None:
            timestamp = time.time()
        for offset in range(-cls.TOLERANCE, cls.TOLERANCE + 1):
            expected = cls.generate_otp(secret, timestamp + offset * cls.PERIOD)
            if hmac.compare_digest(expected, code):
                return True
        return False

    @staticmethod
    def generate_sms_code() -> str:
        """Generate a random 6-digit SMS verification code for 2FA."""
        return str(secrets.randbelow(900000) + 100000)

    @staticmethod
    def get_provisioning_uri(secret: str, email: str) -> str:
        """Generate otpauth:// URI for authenticator app."""
        issuer = "CareNest"
        return "otpauth://totp/" + issuer + ":" + email + "?secret=" + secret + "&issuer=" + issuer + "&algorithm=SHA1&digits=6&period=30"
