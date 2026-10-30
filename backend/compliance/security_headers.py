"""
Security Headers Middleware for CareNest
Adds: X-Frame-Options, Strict-Transport-Security (HSTS),
Content-Security-Policy (CSP), Referrer-Policy, X-Content-Type-Options, CORS.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds security headers including HSTS for HTTPS enforcement."""

    SWAGGER_PATHS = ("/docs", "/redoc", "/openapi.json")

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Exempt Swagger UI paths — strict CSP blocks its CDN scripts/styles
        if request.url.path not in self.SWAGGER_PATHS:
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
                "connect-src 'self'; frame-ancestors 'none'"
            )
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response
