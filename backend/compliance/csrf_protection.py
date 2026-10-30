"""
CSRF Protection Middleware
Uses double-submit cookie with XSRF-TOKEN and SameSite enforcement.
"""

import secrets
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse


class CSRFMiddleware(BaseHTTPMiddleware):
    """Cross-site request forgery protection via csrf_token cookie."""

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}
    HEADER_NAME = "X-XSRF-Token"
    COOKIE_NAME = "XSRF-TOKEN"

    async def dispatch(self, request: Request, call_next):
        if request.method in self.SAFE_METHODS:
            response = await call_next(request)
            csrf_token = secrets.token_urlsafe(32)
            response.set_cookie(self.COOKIE_NAME, csrf_token, httponly=False, samesite="lax", secure=True, path="/")
            return response
        cookie_token = request.cookies.get(self.COOKIE_NAME)
        header_token = request.headers.get(self.HEADER_NAME)
        if not cookie_token or not header_token or cookie_token != header_token:
            return JSONResponse(status_code=403, content={"error": "csrf_validation_failed", "message": "Invalid CSRF token"})
        response = await call_next(request)
        response.headers.setdefault("Set-Cookie", "SameSite=Lax; Secure")
        return response
