"""HIPAA PHI Field-Level Encryption — § 164.312(a)(2)(iv)."""
from sqlalchemy import TypeDecorator, String

PHI_FIELD_NAMES = ["ssn", "date_of_birth", "diagnosis", "medical_record_number", "insurance_id", "phone", "email", "address"]


class EncryptedString(TypeDecorator):
    """SQLAlchemy column type that auto-encrypts/decrypts PHI."""
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            from compliance.encryption import encrypt_phi
            return encrypt_phi(str(value))
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            from compliance.encryption import decrypt_phi
            return decrypt_phi(value)
        return value
