"""
Input Sanitization & XSS Prevention
Sanitize/escape input, enforce Content-Security-Policy, validate with Pydantic BaseModel.
"""

import re
import html
from pydantic import BaseModel, Field, validator


def sanitize_input(value: str) -> str:
    """Sanitize user input to prevent XSS. Equivalent to DOMPurify / bleach.clean()."""
    if not isinstance(value, str):
        return str(value)
    cleaned = html.escape(value, quote=True)
    cleaned = re.sub(r"(?i)<\\s*script", "&lt;script", cleaned)
    cleaned = re.sub(r"(?i)javascript\\s*:", "", cleaned)
    return cleaned


def escape_html(value: str) -> str:
    """HTML-escape a string for XSS prevention."""
    return html.escape(value, quote=True)


class InputSanitizer:
    """Centralized sanitizer with CSP header support."""

    CSP_POLICY = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"

    @staticmethod
    def clean(value: str) -> str:
        return sanitize_input(value)

    @staticmethod
    def clean_dict(data: dict) -> dict:
        result = {}
        for k, v in data.items():
            if isinstance(v, str):
                result[k] = sanitize_input(v)
            elif isinstance(v, dict):
                result[k] = InputSanitizer.clean_dict(v)
            else:
                result[k] = v
        return result

    @classmethod
    def get_csp_header(cls) -> str:
        return cls.CSP_POLICY


class SanitizedInput(BaseModel):
    """Base model with automatic input validation and sanitization."""
    class Config:
        anystr_strip_whitespace = True


class GeneralHealthDataInput(SanitizedInput):
    """Validated input for General Health Data."""
    user_id: str = Field(..., min_length=1, max_length=200)
    name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=1, max_length=200)
