#!/usr/bin/env python3
"""Bounded runtime attestation for declared outbound HTTP(S) policy.

Exit codes:
  0 policy matches observed behavior
  2 policy mismatch
  3 invalid policy/input
  4 probe/runtime failure with indeterminate result

No credentials are read or sent. Redirects are disabled to avoid probing
undeclared destinations indirectly.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse


def fail(msg: str, code: int) -> None:
    print(json.dumps({"status": "error", "message": msg}), file=sys.stderr)
    raise SystemExit(code)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def load_policy(path: Path) -> dict:
    try:
        raw = path.read_bytes()
        data = json.loads(raw)
    except Exception as exc:
        fail(f"cannot read policy: {exc}", 3)
    if data.get("version") != 1:
        fail("policy.version must be 1", 3)
    timeout = data.get("timeout_seconds", 3)
    max_probes = data.get("max_probes", 20)
    if not isinstance(timeout, (int, float)) or timeout <= 0 or timeout > 15:
        fail("timeout_seconds must be >0 and <=15", 3)
    if not isinstance(max_probes, int) or max_probes < 1 or max_probes > 100:
        fail("max_probes must be 1..100", 3)
    probes = data.get("allow", []) + data.get("deny", [])
    if len(probes) > max_probes:
        fail("probe count exceeds max_probes", 3)
    seen = set()
    for item in probes:
        if not isinstance(item, dict) or not item.get("name") or not item.get("url"):
            fail("each probe requires name and url", 3)
        if item["name"] in seen:
            fail(f"duplicate probe name: {item['name']}", 3)
        seen.add(item["name"])
        parsed = urlparse(item["url"])
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            fail(f"unsupported url: {item['url']}", 3)
        if parsed.username or parsed.password:
            fail("credentials in probe URLs are forbidden", 3)
        if item.get("method", "HEAD") not in {"HEAD", "GET"}:
            fail("method must be HEAD or GET", 3)
    data["_hash"] = hashlib.sha256(raw).hexdigest()
    return data


def probe(item: dict, timeout: float) -> dict:
    url = item["url"]
    method = item.get("method", "HEAD")
    started = time.monotonic()
    req = urllib.request.Request(url, method=method, headers={"User-Agent": "egress-attest/1"})
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(req, timeout=timeout) as resp:
            reachable = True
            detail = f"http_{resp.status}"
    except urllib.error.HTTPError as exc:
        # A real HTTP response proves network reachability even when the app rejects it.
        reachable = True
        detail = f"http_{exc.code}"
    except (urllib.error.URLError, socket.timeout, TimeoutError, ssl.SSLError, OSError) as exc:
        reachable = False
        detail = type(exc).__name__
    return {
        "name": item["name"],
        "url": url,
        "reachable": reachable,
        "detail": detail,
        "elapsed_ms": round((time.monotonic() - started) * 1000, 1),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("policy", type=Path)
    ap.add_argument("--output", type=Path)
    args = ap.parse_args()
    policy = load_policy(args.policy)
    timeout = float(policy["timeout_seconds"])
    results = []
    mismatch = False

    for expected, items in (("allow", policy.get("allow", [])), ("deny", policy.get("deny", []))):
        for item in items:
            r = probe(item, timeout)
            r["expected"] = expected
            r["verdict"] = "pass" if ((expected == "allow" and r["reachable"]) or (expected == "deny" and not r["reachable"])) else "fail"
            if r["verdict"] == "fail":
                mismatch = True
            results.append(r)

    over_permissive = [r["name"] for r in results if r["expected"] == "deny" and r["reachable"]]
    over_restrictive = [r["name"] for r in results if r["expected"] == "allow" and not r["reachable"]]
    report = {
        "status": "mismatch" if mismatch else "pass",
        "policy_sha256": policy["_hash"],
        "over_permissive": over_permissive,
        "over_restrictive": over_restrictive,
        "results": results,
    }
    text = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        try:
            args.output.write_text(text + "\n", encoding="utf-8")
        except OSError as exc:
            fail(f"cannot write output: {exc}", 4)
    print(text)
    return 2 if mismatch else 0


if __name__ == "__main__":
    raise SystemExit(main())
