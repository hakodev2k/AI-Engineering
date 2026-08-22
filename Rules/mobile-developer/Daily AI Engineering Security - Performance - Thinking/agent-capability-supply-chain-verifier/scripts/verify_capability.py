#!/usr/bin/env python3
"""Pre-install verifier for agent-discovered capabilities.

Input JSON example:
{
  "source_url": "https://github.com/owner/repo",
  "owner": "owner",
  "immutable_ref": "40-hex-commit-or-version",
  "artifact_path": "./package.tgz",
  "install_command": "npm install package",
  "approval": {"granted": false, "sha256": null, "approved_at_epoch": null}
}
Exit: 0 allow, 2 invalid input, 4 approval required, 5 deny.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys, time
from pathlib import Path
from urllib.parse import urlparse

ALLOW, INVALID, APPROVAL, DENY = 0, 2, 4, 5
HEX40 = re.compile(r"^[0-9a-fA-F]{40}$")


def load(path: Path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def sha256_file(path: Path, max_bytes: int) -> str:
    try:
        size = path.stat().st_size
    except OSError as exc:
        raise ValueError(f"cannot stat artifact: {exc}") from exc
    if size < 0 or size > max_bytes:
        raise ValueError(f"artifact size {size} exceeds configured limit {max_bytes}")
    h = hashlib.sha256()
    try:
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
    except OSError as exc:
        raise ValueError(f"cannot read artifact: {exc}") from exc
    return h.hexdigest()


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path)
    p.add_argument("--policy", type=Path, required=True)
    args = p.parse_args()
    try:
        data, policy = load(args.input), load(args.policy)
        url = data.get("source_url")
        owner = data.get("owner")
        ref = data.get("immutable_ref")
        artifact_path = data.get("artifact_path")
        command = data.get("install_command", "")
        approval = data.get("approval", {})
        if not isinstance(url, str) or not isinstance(owner, str) or not owner.strip():
            raise ValueError("source_url and owner are required strings")
        if not isinstance(command, str) or not isinstance(approval, dict):
            raise ValueError("install_command must be string and approval must be object")
        parsed = urlparse(url)
        host = (parsed.hostname or "").lower()
        allowed_domains = {str(x).lower() for x in policy.get("allowed_domains", [])}
        findings = []
        decision, code = "allow", ALLOW
        if host not in allowed_domains:
            findings.append(f"source domain {host!r} not allowlisted")
            decision, code = "deny", DENY
        denied = {str(x).lower() for x in policy.get("denied_owners", [])}
        if owner.lower() in denied:
            findings.append("owner explicitly denied")
            decision, code = "deny", DENY
        if policy.get("require_immutable_ref", True) and (not isinstance(ref, str) or not HEX40.match(ref)):
            findings.append("immutable 40-hex commit ref required")
            decision, code = "deny", DENY
        digest = None
        if policy.get("require_sha256", True):
            if not isinstance(artifact_path, str) or not artifact_path:
                raise ValueError("artifact_path required when require_sha256=true")
            digest = sha256_file(Path(artifact_path), int(policy.get("max_artifact_bytes", 104857600)))
        lowered = command.lower().replace(" ", "")
        for token in policy.get("dangerous_install_tokens", []):
            if str(token).lower().replace(" ", "") in lowered:
                findings.append(f"dangerous install pattern detected: {token}")
                decision, code = "deny", DENY
        allowed_owners = {str(x).lower() for x in policy.get("allowed_owners", [])}
        needs_approval = policy.get("require_human_approval_when_owner_not_allowlisted", True) and owner.lower() not in allowed_owners
        if code != DENY and needs_approval:
            granted = approval.get("granted") is True
            bound = digest is not None and approval.get("sha256") == digest
            approved_at = approval.get("approved_at_epoch")
            fresh = isinstance(approved_at, (int, float)) and not isinstance(approved_at, bool) and 0 <= time.time() - approved_at <= int(policy.get("approval_ttl_minutes", 60)) * 60
            if not (granted and bound and fresh):
                findings.append("evidence-bound fresh human approval required")
                decision, code = "approval_required", APPROVAL
        result = {
            "decision": decision,
            "canonical_host": host,
            "owner": owner,
            "immutable_ref": ref,
            "sha256": digest,
            "sandbox_required": bool(policy.get("require_sandbox_after_install", True)),
            "findings": findings,
        }
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr)
        return INVALID
    print(json.dumps(result, indent=2))
    return code

if __name__ == "__main__":
    raise SystemExit(main())
