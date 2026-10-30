"""
Rate Limiting for CareNest
Uses slowapi. Returns HTTP 429 (Too Many Requests) when limits exceeded.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for HTTP 429 Too Many Requests."""
    return JSONResponse(
        status_code=429,
        content={"error": "rate_limit_exceeded", "message": "Too many requests. Please try again later.", "retry_after": str(exc.detail)},
    )


def setup_rate_limiting(app):
    """Configure rate limiting with slowapi throttle limits."""
    limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"], storage_uri="memory://")
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    return limiter
