import hashlib
import hmac


def expected_approval(secret: str, tool: str) -> str:
    return hmac.new(secret.encode(), tool.encode(), hashlib.sha256).hexdigest()


def require_approval(tool: str, supplied: str | None, secret: str | None) -> None:
    if not secret:
        raise PermissionError(f"{tool} requires approval but QDRANT_APPROVAL_SECRET is not configured")
    expected = expected_approval(secret, tool)
    if not supplied or not hmac.compare_digest(supplied, expected):
        raise PermissionError(f"Explicit approval required for {tool}")
