#!/usr/bin/env python3
import argparse, hashlib, json, os, platform, shutil, subprocess, sys
from datetime import datetime, timezone


def run(cmd):
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        return p.stdout.strip() if p.returncode == 0 else None
    except Exception:
        return None


def version_of(exe, args):
    path = shutil.which(exe)
    if not path:
        return None
    out = run([path] + args)
    return out.splitlines()[0] if out else None


def fingerprint(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output", required=True)
    ap.add_argument("--name", default="test-environment")
    ap.add_argument("--source", default="local")
    args = ap.parse_args()

    dims = {
        "runtime": {"provider": "python", "version": platform.python_version(), "capabilities": []},
        "operating_system": {"provider": platform.system().lower(), "version": platform.release(), "capabilities": []}
    }
    probes = {
        "dotnet": ("dotnet", ["--version"]),
        "node": ("node", ["--version"]),
        "docker": ("docker", ["--version"]),
        "psql": ("psql", ["--version"]),
        "redis": ("redis-server", ["--version"])
    }
    tool_versions = {k: version_of(*v) for k, v in probes.items()}
    tool_versions = {k: v for k, v in tool_versions.items() if v}
    snapshot = {
        "version": 1,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "environment_name": args.name,
        "source": args.source,
        "host": {"architecture": platform.machine(), "python": platform.python_version()},
        "dimensions": dims,
        "tools": tool_versions,
        "environment_variables_present": sorted([k for k in os.environ if k.endswith("_VERSION") or k in {"CI", "DOTNET_ENVIRONMENT", "ASPNETCORE_ENVIRONMENT"}])
    }
    snapshot["snapshot_fingerprint"] = fingerprint(snapshot)
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, sort_keys=True)
    print(snapshot["snapshot_fingerprint"])
    return 0

if __name__ == "__main__":
    sys.exit(main())
