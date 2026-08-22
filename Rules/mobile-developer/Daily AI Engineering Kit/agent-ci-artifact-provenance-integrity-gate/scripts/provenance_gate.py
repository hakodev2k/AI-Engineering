#!/usr/bin/env python3
import argparse, fnmatch, hashlib, json, os, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path


def git(args):
    p = subprocess.run(["git", *args], capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def parse_simple_yaml(path):
    data, current = {}, None
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("- ") and current:
            data.setdefault(current, []).append(line[2:].strip("'\""))
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if not v:
                data[k], current = [], k
            else:
                current = None
                if v.lower() in ("true", "false"):
                    data[k] = v.lower() == "true"
                elif v.isdigit():
                    data[k] = int(v)
                else:
                    data[k] = v.strip("'\"")
    return data


def collect_files(roots, ignores):
    files = []
    for root in roots:
        p = Path(root)
        if not p.exists():
            continue
        for f in p.rglob("*"):
            if not f.is_file():
                continue
            rel = f.as_posix()
            if any(fnmatch.fnmatch(f.name, pat) or fnmatch.fnmatch(rel, pat) for pat in ignores):
                continue
            files.append(f)
    return sorted(files)


def main():
    ap = argparse.ArgumentParser(description="Verify CI artifact provenance and deterministic hashes")
    ap.add_argument("--policy", default="config/policy.yaml")
    ap.add_argument("--expected-commit")
    ap.add_argument("--manifest", default="artifact-manifest.json")
    ap.add_argument("--write-manifest", action="store_true")
    ap.add_argument("--output", default="provenance-result.json")
    args = ap.parse_args()

    findings = []
    try:
        policy = parse_simple_yaml(args.policy)
        commit = git(["rev-parse", "HEAD"])
        expected = args.expected_commit or os.getenv("BUILD_COMMIT_SHA")
        if policy.get("require_build_commit_match", True) and expected and commit != expected:
            findings.append({"severity":"error","code":"COMMIT_MISMATCH","message":f"HEAD {commit} differs from expected {expected}"})

        roots = policy.get("artifact_roots", ["artifacts", "dist", "publish"])
        ignores = policy.get("ignore_patterns", [])
        files = collect_files(roots, ignores)
        max_entries = policy.get("max_manifest_entries", 5000)
        if len(files) > max_entries:
            findings.append({"severity":"error","code":"MANIFEST_TOO_LARGE","message":f"{len(files)} artifacts exceed limit {max_entries}"})

        artifacts = [{"path": f.as_posix(), "sha256": sha256(f), "size": f.stat().st_size} for f in files]
        manifest_obj = {"commit": commit, "artifacts": artifacts}
        manifest_path = Path(args.manifest)

        if args.write_manifest:
            manifest_path.write_text(json.dumps(manifest_obj, indent=2) + "\n", encoding="utf-8")
        elif policy.get("require_manifest", True):
            if not manifest_path.exists():
                findings.append({"severity":"error","code":"MANIFEST_MISSING","message":f"Missing {manifest_path}"})
            else:
                try:
                    existing = json.loads(manifest_path.read_text(encoding="utf-8"))
                    if existing.get("commit") != commit:
                        findings.append({"severity":"error","code":"MANIFEST_COMMIT_MISMATCH","message":"Manifest commit does not equal repository HEAD"})
                    expected_map = {a["path"]: a for a in existing.get("artifacts", [])}
                    actual_map = {a["path"]: a for a in artifacts}
                    for path, actual in actual_map.items():
                        prior = expected_map.get(path)
                        if not prior:
                            findings.append({"severity":"error","code":"UNTRACKED_ARTIFACT","message":path})
                        elif prior.get("sha256") != actual["sha256"] or prior.get("size") != actual["size"]:
                            findings.append({"severity":"error","code":"ARTIFACT_HASH_MISMATCH","message":path})
                    for path in expected_map.keys() - actual_map.keys():
                        findings.append({"severity":"error","code":"ARTIFACT_MISSING","message":path})
                except (json.JSONDecodeError, KeyError, TypeError) as e:
                    findings.append({"severity":"error","code":"MANIFEST_INVALID","message":str(e)})

        release = os.getenv("RELEASE_BUILD", "false").lower() == "true"
        signature_ok = os.getenv("ARTIFACT_SIGNATURE_VERIFIED", "false").lower() == "true"
        if release and policy.get("require_signature_for_release", True) and not signature_ok:
            severity = "warning" if policy.get("release_signature_approval_required", True) else "error"
            findings.append({"severity":severity,"code":"RELEASE_SIGNATURE_REQUIRED","message":"Release artifact signature is not verified"})

        errors = any(f["severity"] == "error" for f in findings)
        needs_approval = any(f["code"] == "RELEASE_SIGNATURE_REQUIRED" and f["severity"] == "warning" for f in findings)
        status = "blocked" if errors else ("needs-approval" if needs_approval else "verified")
        result = {"status": status, "commit": commit, "artifacts": artifacts, "findings": findings, "verified_at": datetime.now(timezone.utc).isoformat()}
        Path(args.output).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result, indent=2))
        return 2 if errors else (3 if needs_approval else 0)
    except Exception as e:
        print(f"provenance gate failed: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
