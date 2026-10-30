"""HIPAA Audit Logging — § 164.312(b) Audit Controls."""
import logging
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from ._base import Base

logger = logging.getLogger(__name__)


class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(200))
    details = Column(Text)
    ip_address = Column(String(45))
    timestamp = Column(DateTime, default=datetime.utcnow)


class HIPAAAuditMiddleware:
    """Middleware that logs all API access for HIPAA audit trail."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            logger.info("AUDIT: %s %s", scope.get("method", ""), scope.get("path", ""))
        await self.app(scope, receive, send)
