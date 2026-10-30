"""HIPAA Emergency Access Procedure — § 164.312(a)(2)(ii)."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from ._base import Base


class EmergencyAccessLog(Base):
    __tablename__ = "emergency_access_log"
    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    patient_id = Column(String, nullable=False)
    justification = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    reviewed = Column(Boolean, default=False)
    reviewed_by = Column(String)


def break_glass_access(user_id: str, patient_id: str, justification: str, db=None):
    """Grant emergency access with mandatory justification (break-glass)."""
    log = EmergencyAccessLog(
        user_id=user_id, patient_id=patient_id, justification=justification,
    )
    if db:
        db.add(log)
        db.commit()
    return {"granted": True, "log_id": log.id if db else None, "message": "Emergency access granted — admin review required"}
