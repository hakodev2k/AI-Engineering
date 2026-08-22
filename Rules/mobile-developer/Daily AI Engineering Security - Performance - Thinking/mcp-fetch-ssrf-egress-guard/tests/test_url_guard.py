#!/usr/bin/env python3
"""Deterministic unit tests for URL policy evaluation without real network access."""
from __future__ import annotations

import importlib.util
import ipaddress
import json
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("url_guard", ROOT / "scripts" / "url_guard.py")
mod = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(mod)
POLICY = json.loads((ROOT / "config" / "policy.json").read_text(encoding="utf-8"))


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    cases = [
        ("http://127.0.0.1/admin", ["127.0.0.1"], "deny"),
        ("http://169.254.169.254/latest", ["169.254.169.254"], "deny"),
        ("http://10.1.2.3/x", ["10.1.2.3"], "deny"),
        ("http://[::1]/", ["::1"], "deny"),
        ("https://example.test/path", ["93.184.216.34"], "allow"),
        ("https://mixed.test/", ["93.184.216.34", "10.0.0.7"], "deny"),
    ]
    for url, ips, expected in cases:
        with patch.object(mod, "resolve", return_value=[ipaddress.ip_address(x) for x in ips]):
            result = mod.evaluate(url, POLICY)
        check(result["decision"] == expected, f"{url}: expected {expected}, got {result}")

    check(mod.evaluate("file:///etc/passwd", POLICY)["decision"] == "deny", "file scheme must be denied")
    check(mod.evaluate("https://user:pass@example.test/", POLICY)["decision"] == "deny", "userinfo must be denied")

    allow_policy = dict(POLICY)
    allow_policy["domain_allowlist"] = ["example.com"]
    with patch.object(mod, "resolve", return_value=[ipaddress.ip_address("93.184.216.34")]):
        check(mod.evaluate("https://api.example.com/a", allow_policy)["decision"] == "allow", "subdomain should match allowlist")
        check(mod.evaluate("https://example.com.evil.test/a", allow_policy)["decision"] == "deny", "suffix confusion must fail")
    print("url_guard tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
