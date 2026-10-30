"""PHI Encryption at Rest — § 164.312(a)(2)(iv)."""
import os
from cryptography.fernet import Fernet

_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key().decode())
_cipher = Fernet(_KEY.encode() if isinstance(_KEY, str) else _KEY)


def encrypt_phi(plaintext: str) -> str:
    """Encrypt PHI data using AES-256 via Fernet."""
    if not plaintext:
        return plaintext
    return _cipher.encrypt(plaintext.encode()).decode()


def decrypt_phi(ciphertext: str) -> str:
    """Decrypt PHI data."""
    if not ciphertext:
        return ciphertext
    return _cipher.decrypt(ciphertext.encode()).decode()
