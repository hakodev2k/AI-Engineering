#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

from url_policy import decide, load_policy


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def bounded_read(response, limit: int) -> bytes:
    data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError(f"response exceeds max_response_bytes={limit}")
    return data


def fetch(url: str, policy: dict, resolve_json: str | None = None) -> dict:
    current = url
    opener = urllib.request.build_opener(NoRedirect())
    max_redirects = int(policy.get("max_redirects", 3))
    timeout = float(policy.get("read_timeout_seconds", 10))
    max_bytes = int(policy.get("max_response_bytes", 1048576))
    audit = []

    for hop in range(max_redirects + 1):
        decision = decide(current, policy, "fetch", resolve_json)
        audit.append({"hop": hop, "url": current, "decision": decision["decision"], "reason": decision["reason"]})
        if decision["decision"] != "ALLOW":
            return {"ok": False, "reason": "url_policy_denied", "audit": audit}

        req = urllib.request.Request(current, headers={"User-Agent": "mcp-oauth-metadata-ssrf-guard/1"})
        try:
            with opener.open(req, timeout=timeout) as response:
                status = getattr(response, "status", 200)
                body = bounded_read(response, max_bytes)
                ctype = response.headers.get("Content-Type", "")
                return {
                    "ok": 200 <= status < 300,
                    "status": status,
                    "content_type": ctype,
                    "bytes": len(body),
                    "body": body.decode("utf-8", errors="replace"),
                    "audit": audit,
                }
        except urllib.error.HTTPError as exc:
            if exc.code in (301, 302, 303, 307, 308):
                location = exc.headers.get("Location")
                if not location:
                    return {"ok": False, "status": exc.code, "reason": "redirect_without_location", "audit": audit}
                if hop >= max_redirects:
                    return {"ok": False, "status": exc.code, "reason": "redirect_limit_exceeded", "audit": audit}
                current = urljoin(current, location)
                continue
            return {"ok": False, "status": exc.code, "reason": "http_error", "audit": audit}
        except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
            return {"ok": False, "reason": "network_or_size_error", "error": str(exc), "audit": audit}

    return {"ok": False, "reason": "redirect_limit_exceeded", "audit": audit}


def main() -> int:
    p = argparse.ArgumentParser(description="Bounded, redirect-aware fetch for MCP OAuth metadata")
    p.add_argument("--policy", required=True)
    p.add_argument("--url", required=True)
    p.add_argument("--resolve-json")
    p.add_argument("--output", help="Optional file for response body; stdout contains audit JSON")
    args = p.parse_args()
    try:
        policy = load_policy(args.policy)
        result = fetch(args.url, policy, args.resolve_json)
        body = result.pop("body", None)
        if body is not None and args.output:
            Path(args.output).write_text(body, encoding="utf-8")
            result["body_saved_to"] = args.output
        elif body is not None:
            result["body_preview"] = body[:1000]
            result["body_truncated_in_output"] = len(body) > 1000
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result.get("ok") else 3
    except Exception as exc:
        print(json.dumps({"ok": False, "reason": "fatal", "error": str(exc)}, indent=2))
        return 4


if __name__ == "__main__":
    sys.exit(main())
