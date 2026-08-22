#!/usr/bin/env python3
"""Fail-closed preflight for trusted plugin service paths and provenance."""
from __future__ import annotations
import argparse, hashlib, json, os, sys
from pathlib import Path
from typing import Any


def load(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read config: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("config must be a JSON object")
    return data


def canon(value: str) -> Path:
    return Path(value).expanduser().resolve(strict=False)


def contained(child: Path, parent: Path) -> bool:
    try:
        child.relative_to(parent)
        return True
    except ValueError:
        return False


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def evaluate(cfg: dict[str, Any]) -> dict[str, Any]:
    errors: list[dict[str, str]] = []
    root_raw, service_raw = cfg.get("plugin_root"), cfg.get("service_path")
    if not isinstance(root_raw, str) or not isinstance(service_raw, str):
        raise ValueError("plugin_root and service_path are required strings")
    root, service = canon(root_raw), canon(service_raw)
    if not service.is_file():
        errors.append({"code": "service_missing", "detail": "service file does not exist"})
    if not contained(service, root):
        errors.append({"code": "path_escape", "detail": "service resolves outside plugin root"})

    expected_hash = cfg.get("expected_sha256")
    actual_hash = None
    if service.is_file() and expected_hash is not None:
        if not isinstance(expected_hash, str) or len(expected_hash) != 64:
            raise ValueError("expected_sha256 must be a 64-character hex string")
        actual_hash = sha256(service)
        if actual_hash.lower() != expected_hash.lower():
            errors.append({"code": "hash_mismatch", "detail": "service hash differs from trusted manifest"})

    for key in ("trusted_roots", "sandbox_trusted_roots"):
        roots = cfg.get(key, [])
        if not isinstance(roots, list) or not all(isinstance(x, str) for x in roots):
            raise ValueError(f"{key} must be an array of strings")
        if not roots or not any(contained(service, canon(r)) for r in roots):
            errors.append({"code": f"{key}_miss", "detail": "service is not contained by an effective trusted root"})

    required_env = cfg.get("required_child_env", {})
    if not isinstance(required_env, dict):
        raise ValueError("required_child_env must be an object")
    child_env = cfg.get("child_env", {})
    if not isinstance(child_env, dict):
        raise ValueError("child_env must be an object")
    for name, expected in required_env.items():
        if child_env.get(name) != expected:
            errors.append({"code": "env_propagation", "detail": f"required child variable {name} is missing or changed"})

    native = cfg.get("native_host")
    if native is not None:
        if not isinstance(native, dict):
            raise ValueError("native_host must be an object")
        manifest = native.get("manifest")
        registered_manifest = native.get("registered_manifest")
        if not isinstance(manifest, str) or not Path(manifest).expanduser().is_file():
            errors.append({"code": "native_manifest_missing", "detail": "native host manifest is missing"})
        elif not isinstance(registered_manifest, str) or canon(manifest) != canon(registered_manifest):
            errors.append({"code": "native_registration_mismatch", "detail": "registration does not point to expected manifest"})

    return {
        "status": "pass" if not errors else "block",
        "plugin_root": str(root),
        "service_path": str(service),
        "sha256_checked": expected_hash is not None,
        "actual_sha256": actual_hash,
        "errors": errors,
    }


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    args = p.parse_args()
    try:
        result = evaluate(load(args.config))
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2))
    return 0 if result["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
