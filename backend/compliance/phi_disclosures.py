"""HIPAA Accounting of Disclosures — § 164.528."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from ._base import Base


class PHIDisclosureLog(Base):
    __tablename__ = "phi_disclosures"
    id = Column(Integer, primary_key=True)
    patient_id = Column(String, index=True, nullable=False)
    accessed_by = Column(String, nullable=False)
    purpose = Column(String(200))
    phi_fields = Column(Text)  # comma-separated field names
    timestamp = Column(DateTime, default=datetime.utcnow)


def log_phi_access(patient_id: str, accessed_by: str, purpose: str, fields: list, db=None):
    """Log PHI access for accounting of disclosures."""
    entry = PHIDisclosureLog(
        patient_id=patient_id, accessed_by=accessed_by,
        purpose=purpose, phi_fields=",".join(fields),
    )
    if db:
        db.add(entry)
        db.commit()
    return entry
