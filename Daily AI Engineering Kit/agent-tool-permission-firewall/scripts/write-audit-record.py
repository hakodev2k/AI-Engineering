#!/usr/bin/env python3
import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def main():
    parser = argparse.ArgumentParser(description="Append an AI tool permission decision to a local JSONL audit log.")
    parser.add_argument("--request", required=True)
    parser.add_argument("--decision", required=True)
    parser.add_argument("--status", default="unknown")
    parser.add_argument("--audit-path", default=os.getenv("AGENT_AUDIT_PATH", ".agent-audit/tool-actions.jsonl"))
    args = parser.parse_args()

    request = load_json(Path(args.request))
    decision = load_json(Path(args.decision))

    if decision.get("decision") not in {"allow", "approval_required", "deny"}:
        raise SystemExit("Decision file contains an unsupported decision")

    record = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "request": request,
        "decision": decision,
        "execution_status": args.status
    }

    path = Path(args.audit_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, separators=(",", ":")) + "\n")

    print(str(path))


if __name__ == "__main__":
    main()
