from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    binary: str
    app_token: str | None
    timeout_seconds: float
    max_code_bytes: int
    max_files: int


def load_config(env: dict[str, str] | None = None) -> Config:
    values = os.environ if env is None else env
    binary = values.get("SEMGREP_BINARY", "semgrep").strip()
    if not binary or "/" in binary or "\\" in binary:
        raise ValueError("SEMGREP_BINARY must be a command name, not a path")
    timeout = float(values.get("SEMGREP_UPSTREAM_TIMEOUT_SECONDS", "120"))
    max_bytes = int(values.get("SEMGREP_MAX_CODE_BYTES", "500000"))
    max_files = int(values.get("SEMGREP_MAX_FILES", "50"))
    if not 5 <= timeout <= 600:
        raise ValueError("SEMGREP_UPSTREAM_TIMEOUT_SECONDS must be between 5 and 600")
    if not 1024 <= max_bytes <= 5_000_000:
        raise ValueError("SEMGREP_MAX_CODE_BYTES must be between 1024 and 5000000")
    if not 1 <= max_files <= 200:
        raise ValueError("SEMGREP_MAX_FILES must be between 1 and 200")
    token = values.get("SEMGREP_APP_TOKEN", "").strip() or None
    return Config(binary=binary, app_token=token, timeout_seconds=timeout, max_code_bytes=max_bytes, max_files=max_files)
