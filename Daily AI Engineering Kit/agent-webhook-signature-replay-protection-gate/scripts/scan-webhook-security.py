#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def load_config(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ["source_roots", "exclude_dirs", "extensions", "boundary_patterns", "signature_patterns", "raw_body_patterns", "freshness_patterns", "replay_patterns"]
    missing = [k for k in required if k not in data]
    if missing:
        raise ValueError(f"missing config keys: {', '.join(missing)}")
    return data


def contains_any(text: str, patterns):
    lower = text.lower()
    return [p for p in patterns if p.lower() in lower]


def scan_file(path: Path, cfg):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return {"path": str(path), "error": str(exc), "findings": []}
    boundary = contains_any(text, cfg["boundary_patterns"])
    if not boundary:
        return None
    evidence = {
        "signature": contains_any(text, cfg["signature_patterns"]),
        "raw_body": contains_any(text, cfg["raw_body_patterns"]),
        "freshness": contains_any(text, cfg["freshness_patterns"]),
        "replay": contains_any(text, cfg["replay_patterns"]),
    }
    findings = []
    for key, severity, message in [
        ("signature", "high", "Webhook-like boundary has no recognizable signature verification evidence."),
        ("raw_body", "medium", "No recognizable raw-body handling evidence was found."),
        ("freshness", "medium", "No recognizable freshness/timestamp validation evidence was found."),
        ("replay", "high", "No recognizable replay/idempotency evidence was found."),
    ]:
        if not evidence[key]:
            findings.append({"severity": severity, "code": f"missing-{key.replace('_','-')}", "message": message})
    return {"path": str(path), "boundary_matches": boundary, "evidence": evidence, "findings": findings}


def iter_files(repo: Path, cfg):
    roots = [repo / root for root in cfg["source_roots"] if (repo / root).exists()]
    if not roots:
        roots = [repo]
    excluded = set(cfg["exclude_dirs"])
    extensions = set(cfg["extensions"])
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix not in extensions:
                continue
            if any(part in excluded for part in path.parts):
                continue
            yield path


def main():
    ap = argparse.ArgumentParser(description="Heuristically scan webhook boundaries for security evidence.")
    ap.add_argument("--repo", required=True)
    ap.add_argument("--config", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    repo = Path(args.repo).resolve()
    if not repo.is_dir():
        raise SystemExit("repository path is not a directory")
    cfg = load_config(Path(args.config))
    results = []
    for path in iter_files(repo, cfg):
        item = scan_file(path, cfg)
        if item:
            item["path"] = str(Path(item["path"]).resolve().relative_to(repo))
            results.append(item)
    high = sum(1 for r in results for f in r.get("findings", []) if f["severity"] == "high")
    payload = {"repository": str(repo), "boundaries_scanned": len(results), "high_findings": high, "results": results}
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps({"boundaries_scanned": len(results), "high_findings": high, "output": str(out)}))
    limit = int(cfg.get("max_unresolved_high_findings", 0))
    raise SystemExit(2 if high > limit else 0)


if __name__ == "__main__":
    main()
