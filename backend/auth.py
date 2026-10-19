
import hashlib
import hmac
import os
import secrets
import sqlite3
import jwt
from datetime import datetime, timedelta, timezone
from pathlib import Path

import time
import random
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

load_dotenv(PROJECT_ROOT / ".env")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))

DB_PATH = Path(
    os.getenv("CAREERFORGE_DB_PATH", str(BASE_DIR / "careerforge.db"))
)


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 before storing it."""
    salt = secrets.token_bytes(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        310_000,
    )
    return f"{salt.hex()}${password_hash.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify a password against its stored hash."""
    try:
        salt_hex, expected_hash = stored_hash.split("$", 1)
        salt = bytes.fromhex(salt_hex)
        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            310_000,
        )
        return hmac.compare_digest(actual_hash.hex(), expected_hash)
    except (ValueError, TypeError):
        return False


def initialize_auth_database() -> None:
    """Create the users table if it doesn't already exist."""
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                email_verified INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS email_otps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL COLLATE NOCASE,
                otp_hash TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        connection.commit()

OTP_EXPIRY_SECONDS = 300
OTP_MAX_ATTEMPTS = 5


def generate_otp() -> str:
    """Generate a cryptographically secure six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """Hash an OTP before storing it."""
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()


def is_valid_otp_format(otp: str) -> bool:
    """Check that an OTP contains exactly six digits."""
    return len(otp) == 6 and otp.isdigit()

def store_email_otp(email: str, otp: str) -> None:
    """Store a hashed OTP with a five-minute expiry."""
    normalized_email = email.strip().lower()
    expires_at = int(time.time()) + OTP_EXPIRY_SECONDS

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            "DELETE FROM email_otps WHERE email = ?",
            (normalized_email,),
        )
        connection.execute(
            """
            INSERT INTO email_otps (email, otp_hash, expires_at, attempts)
            VALUES (?, ?, ?, 0)
            """,
            (normalized_email, hash_otp(otp), expires_at),
        )


def verify_email_otp(email: str, otp: str) -> bool:
    """Verify an OTP, enforcing expiry and an attempt limit."""
    normalized_email = email.strip().lower()

    if not is_valid_otp_format(otp):
        return False

    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row

        row = connection.execute(
            """
            SELECT id, otp_hash, expires_at, attempts
            FROM email_otps
            WHERE email = ?
            """,
            (normalized_email,),
        ).fetchone()

        if row is None:
            return False

        if int(time.time()) >= row["expires_at"]:
            connection.execute(
                "DELETE FROM email_otps WHERE id = ?",
                (row["id"],),
            )
            return False

        if row["attempts"] >= OTP_MAX_ATTEMPTS:
            connection.execute(
                "DELETE FROM email_otps WHERE id = ?",
                (row["id"],),
            )
            return False

        connection.execute(
            "UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?",
            (row["id"],),
        )

        if hmac.compare_digest(hash_otp(otp), row["otp_hash"]):
            connection.execute(
                "DELETE FROM email_otps WHERE id = ?",
                (row["id"],),
            )
            return True

        return False

def send_verification_email(recipient_email: str, otp: str) -> None:
    """Send a verification OTP to the user's email address."""

    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    sender_email = os.getenv("SMTP_EMAIL")
    app_password = os.getenv("SMTP_APP_PASSWORD")

    if not sender_email or not app_password:
        raise RuntimeError("SMTP email credentials are missing.")

    message = EmailMessage()
    message["Subject"] = "CareerForge - Email Verification Code"
    message["From"] = sender_email
    message["To"] = recipient_email

    message.set_content(
        f"""Welcome to CareerForge!

Your email verification code is: {otp}

This code expires in 5 minutes.

If you did not create a CareerForge account, ignore this email.

CareerForge Team"""
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(message)

def create_access_token(user_id: int, email: str) -> str:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is missing from .env")

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=JWT_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is missing from .env")

    return jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
        options={"require": ["sub", "iat", "exp"]},
    )
