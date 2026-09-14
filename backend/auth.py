import os
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException, status
from jose import JWTError, jwt


SECRET_KEY = os.getenv(
    "NANOPREDICT_SECRET_KEY",
    "CHANGE_THIS_SECRET_BEFORE_DEPLOYMENT"
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

USERNAME = "Sharan"

PASSWORD_HASH = os.getenv(
    "NANOPREDICT_PASSWORD_HASH",
    ""
)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    if not hashed_password:
        return False

    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )

    except (ValueError, TypeError):
        return False


def authenticate_user(
    username: str,
    password: str
) -> bool:

    if username != USERNAME:
        return False

    return verify_password(
        password,
        PASSWORD_HASH
    )


def create_access_token(
    username: str,
    expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES
) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes
    )

    payload = {
        "sub": username,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_access_token(token: str) -> str:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if not username:
            raise credentials_exception

        return username

    except JWTError:
        raise credentials_exception
