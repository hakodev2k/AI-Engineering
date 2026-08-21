#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

PATTERNS = {
    "scheduler": re.compile(r"(RecurringJob|AddOrUpdate|cron|schedule|BackgroundService|IHostedService|enqueue|queue)", re.I),
    "retry": re.compile(r"(retry|AutomaticRetry|Polly|backoff|attempt)", re.I),
    "lock": re.compile(r"(DisableConcurrentExecution|distributed.?lock|mutex|semaphore|advisory.?lock|lease|RedLock|sp_getapplock)", re.I),
    "side_effect": re.compile(r"(SaveChanges|ExecuteSql|SendAsync|Publish|Produce|Delete|Update|Insert|POST|PUT|PATCH|email|notification)", re.I),
    "async_loop": re.compile(r"(foreach|for\s*\(|while\s*\().{0,220}(await|SendAsync|SaveChanges)", re.I | re.S),
}


def ignored(path: Path, ignores):
    s = path.as_posix()
    return any(x in s for x in ignores)


def scan(root: Path, extensions, ignores):
    findings = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in extensions or ignored(path, ignores):
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        hits = {name: bool(rx.search(text)) for name, rx in PATTERNS.items()}
        score = sum(hits.values())
        if score >= 2 and (hits["scheduler"] or hits["retry"]) and hits["side_effect"]:
            evidence = [name for name, hit in hits.items() if hit]
            findings.append({
                "file": str(path.relative_to(root)),
                "signals": evidence,
                "score": score,
                "note": "Heuristic candidate only; confirm execution path, overlap window, idempotency, and lock scope manually."
            })
    return sorted(findings, key=lambda x: (-x["score"], x["file"]))


def main():
    p = argparse.ArgumentParser(description="Heuristically locate background-job overlap risks.")
    p.add_argument("--root", required=True)
    p.add_argument("--output")
    p.add_argument("--policy", default=None)
    args = p.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        raise SystemExit(f"Repository root not found: {root}")

    policy = {"scanner": {"extensions": [".cs", ".py", ".js", ".ts", ".yaml", ".yml", ".json"], "ignore_paths": ["bin/", "obj/", "node_modules/", ".git/", "dist/", "build/"]}}
    if args.policy:
        pp = Path(args.policy)
        if not pp.is_file():
            raise SystemExit(f"Policy not found: {pp}")
        policy = json.loads(pp.read_text(encoding="utf-8"))

    scanner = policy.get("scanner", {})
    extensions = {x.lower() for x in scanner.get("extensions", [])}
    ignores = scanner.get("ignore_paths", [])
    findings = scan(root, extensions, ignores)
    report = {"root": str(root), "candidate_count": len(findings), "candidates": findings}
    data = json.dumps(report, indent=2)
    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(data + "\n", encoding="utf-8")
    else:
        print(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
