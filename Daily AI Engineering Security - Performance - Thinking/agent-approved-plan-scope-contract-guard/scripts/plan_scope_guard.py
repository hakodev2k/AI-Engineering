#!/usr/bin/env python3
import argparse
import fnmatch
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

EXIT_OK = 0
EXIT_INPUT = 2
EXIT_SCOPE = 3
EXIT_RUNTIME = 4


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def canonical_contract(contract):
    return json.dumps(contract, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def contract_hash(contract):
    return hashlib.sha256(canonical_contract(contract)).hexdigest()


def run_git(repo: Path, *args):
    cp = subprocess.run(["git", "-C", str(repo), *args], text=True, capture_output=True)
    if cp.returncode != 0:
        raise RuntimeError(cp.stderr.strip() or "git command failed")
    return cp.stdout


def validate_contract(c):
    required = ["contract_id", "version", "goal", "allowed_paths", "forbidden_paths",
                "allowed_operation_classes", "acceptance_criteria", "invariants",
                "baseline_ref", "approved_by", "approved_at"]
    missing = [k for k in required if k not in c]
    if missing:
        raise ValueError("missing contract fields: " + ", ".join(missing))
    if not isinstance(c["allowed_paths"], list) or not c["allowed_paths"]:
        raise ValueError("allowed_paths must be a non-empty list")
    if not isinstance(c["allowed_operation_classes"], list) or not c["allowed_operation_classes"]:
        raise ValueError("allowed_operation_classes must be a non-empty list")


def normalize_repo_path(repo: Path, raw: str):
    p = Path(raw)
    if p.is_absolute():
        try:
            p = p.resolve(strict=False).relative_to(repo.resolve())
        except ValueError:
            return None
    norm = Path(os.path.normpath(str(p))).as_posix()
    if norm == ".." or norm.startswith("../"):
        return None
    return norm.lstrip("./")


def matches(path: str, patterns):
    return any(fnmatch.fnmatch(path, pat) or fnmatch.fnmatch("/" + path, pat) for pat in patterns)


def check_scope(contract, repo: Path, operation: str, raw_path: str):
    if operation not in contract["allowed_operation_classes"]:
        return False, f"operation '{operation}' is not authorized"
    path = normalize_repo_path(repo, raw_path)
    if path is None:
        return False, "path resolves outside repository"
    if matches(path, contract.get("forbidden_paths", [])):
        return False, f"path '{path}' matches forbidden scope"
    if not matches(path, contract["allowed_paths"]):
        return False, f"path '{path}' is outside allowed scope"
    return True, path


def current_changed_files(repo: Path, baseline_ref: str):
    output = run_git(repo, "diff", "--name-only", baseline_ref, "--")
    files = {line.strip() for line in output.splitlines() if line.strip()}
    status = run_git(repo, "status", "--porcelain")
    for line in status.splitlines():
        if not line:
            continue
        payload = line[3:].strip()
        if " -> " in payload:
            payload = payload.split(" -> ", 1)[1]
        if payload:
            files.add(payload.strip('"'))
    return sorted(files)


def cmd_freeze(args):
    repo = Path(args.repo).resolve()
    contract = load_json(Path(args.contract))
    validate_contract(contract)
    actual_hash = contract_hash({k: v for k, v in contract.items() if k != "contract_id"})
    supplied = contract["contract_id"]
    if supplied not in (actual_hash, f"sha256:{actual_hash}"):
        raise ValueError("contract_id does not match canonical contract hash excluding contract_id")
    head = run_git(repo, "rev-parse", "HEAD").strip()
    changed = run_git(repo, "status", "--porcelain").splitlines()
    snapshot = {
        "contract_id": supplied,
        "contract_version": contract["version"],
        "head": head,
        "baseline_ref": contract["baseline_ref"],
        "dirty_status": changed,
    }
    out = Path(args.snapshot)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"frozen": True, "contract_id": supplied, "head": head}))
    return EXIT_OK


def cmd_check(args):
    repo = Path(args.repo).resolve()
    contract = load_json(Path(args.contract))
    validate_contract(contract)
    ok, detail = check_scope(contract, repo, args.operation, args.path)
    result = {"allowed": ok, "operation": args.operation, "path": args.path, "detail": detail}
    print(json.dumps(result, ensure_ascii=False))
    return EXIT_OK if ok else EXIT_SCOPE


def cmd_verify(args):
    repo = Path(args.repo).resolve()
    contract = load_json(Path(args.contract))
    snapshot = load_json(Path(args.snapshot))
    validate_contract(contract)
    if snapshot.get("contract_id") != contract.get("contract_id"):
        raise ValueError("snapshot contract_id does not match active contract")
    violations = []
    changed = current_changed_files(repo, contract["baseline_ref"])
    for path in changed:
        norm = normalize_repo_path(repo, path)
        if norm is None or matches(norm, contract.get("forbidden_paths", [])) or not matches(norm, contract["allowed_paths"]):
            violations.append(path)
    result = {
        "scope_verified": len(violations) == 0,
        "contract_id": contract["contract_id"],
        "changed_files": changed,
        "violations": violations,
        "explained_change_ratio": 1.0 if not changed else (len(changed) - len(violations)) / len(changed),
    }
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"scope_verified={result['scope_verified']} changed={len(changed)} violations={len(violations)}")
        for v in violations:
            print(f"VIOLATION {v}")
    return EXIT_OK if not violations else EXIT_SCOPE


def build_parser():
    p = argparse.ArgumentParser(description="Enforce an approved plan as a path/operation execution contract.")
    sub = p.add_subparsers(dest="command", required=True)
    f = sub.add_parser("freeze")
    f.add_argument("--contract", required=True)
    f.add_argument("--repo", required=True)
    f.add_argument("--snapshot", required=True)
    f.set_defaults(func=cmd_freeze)
    c = sub.add_parser("check")
    c.add_argument("--contract", required=True)
    c.add_argument("--repo", required=True)
    c.add_argument("--operation", required=True)
    c.add_argument("--path", required=True)
    c.set_defaults(func=cmd_check)
    v = sub.add_parser("verify")
    v.add_argument("--contract", required=True)
    v.add_argument("--repo", required=True)
    v.add_argument("--snapshot", required=True)
    v.add_argument("--json", action="store_true")
    v.set_defaults(func=cmd_verify)
    return p


def main():
    try:
        args = build_parser().parse_args()
        return args.func(args)
    except ValueError as exc:
        print(f"input-error: {exc}", file=sys.stderr)
        return EXIT_INPUT
    except (RuntimeError, OSError) as exc:
        print(f"runtime-error: {exc}", file=sys.stderr)
        return EXIT_RUNTIME


if __name__ == "__main__":
    sys.exit(main())
