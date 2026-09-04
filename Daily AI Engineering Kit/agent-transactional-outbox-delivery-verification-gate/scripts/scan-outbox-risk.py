#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def load_config(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ["source_roots", "exclude_dirs", "transaction_patterns", "publish_patterns", "outbox_patterns", "dispatcher_patterns", "max_file_bytes"]
    missing = [k for k in required if k not in data]
    if missing:
        raise ValueError("missing config keys: " + ", ".join(missing))
    return data


def iter_files(repo: Path, cfg):
    excludes = set(cfg["exclude_dirs"])
    roots = [repo / r for r in cfg["source_roots"] if (repo / r).exists()]
    if not roots:
        roots = [repo]
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            if any(part in excludes for part in path.parts):
                continue
            try:
                if path.stat().st_size > int(cfg["max_file_bytes"]):
                    continue
            except OSError:
                continue
            yield path


def contains_any(text: str, patterns):
    lower = text.lower()
    return [p for p in patterns if p.lower() in lower]


def scan(repo: Path, cfg):
    findings = []
    for path in iter_files(repo, cfg):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        tx = contains_any(text, cfg["transaction_patterns"])
        pub = contains_any(text, cfg["publish_patterns"])
        outbox = contains_any(text, cfg["outbox_patterns"])
        dispatcher = contains_any(text, cfg["dispatcher_patterns"])
        rel = str(path.relative_to(repo))
        if tx and pub and not outbox:
            findings.append({"severity": "high", "type": "possible-dual-write", "path": rel, "evidence": {"transaction_patterns": tx, "publish_patterns": pub}})
        if outbox and pub and not dispatcher:
            findings.append({"severity": "medium", "type": "outbox-publish-needs-dispatch-review", "path": rel, "evidence": {"outbox_patterns": outbox, "publish_patterns": pub}})
        if dispatcher and pub and not outbox:
            findings.append({"severity": "low", "type": "dispatcher-without-obvious-outbox-term", "path": rel, "evidence": {"dispatcher_patterns": dispatcher, "publish_patterns": pub}})
    return findings


def main():
    p = argparse.ArgumentParser(description="Heuristically scan for transactional-outbox risks without modifying the repository.")
    p.add_argument("--repo", required=True)
    p.add_argument("--config", required=True)
    p.add_argument("--output", required=True)
    args = p.parse_args()
    repo = Path(args.repo).resolve()
    config_path = Path(args.config).resolve()
    if not repo.is_dir():
        raise SystemExit(f"repository does not exist: {repo}")
    if not config_path.is_file():
        raise SystemExit(f"config does not exist: {config_path}")
    try:
        cfg = load_config(config_path)
        findings = scan(repo, cfg)
    except (ValueError, json.JSONDecodeError) as exc:
        raise SystemExit(f"configuration error: {exc}")
    result = {"repository": str(repo), "finding_count": len(findings), "findings": findings, "note": "Heuristic findings require repository/runtime verification."}
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({"finding_count": len(findings), "output": str(output)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
