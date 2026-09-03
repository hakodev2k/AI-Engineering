#!/usr/bin/env python3
"""Heuristically scan source files for potentially unbounded telemetry dimensions.
Exit codes: 0 pass, 2 policy-blocking findings, 3 invalid input/config.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load_config(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load config: {exc}") from exc
    required = ["source_extensions", "excluded_paths", "dangerous_dimensions", "source_patterns", "blocking_severities", "max_blocking_findings"]
    missing = [k for k in required if k not in data]
    if missing:
        raise ValueError(f"config missing keys: {', '.join(missing)}")
    return data


def scan(repo: Path, config: dict) -> list[dict]:
    extensions = {str(x).lower() for x in config["source_extensions"]}
    excluded = {str(x) for x in config["excluded_paths"]}
    dangerous = [str(x).lower() for x in config["dangerous_dimensions"]]
    patterns = [str(x).lower() for x in config["source_patterns"]]
    findings = []
    for path in repo.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in extensions:
            continue
        rel = path.relative_to(repo)
        if any(part in excluded for part in rel.parts):
            continue
        try:
            lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError:
            continue
        for lineno, line in enumerate(lines, 1):
            low = line.lower()
            if not any(p in low for p in patterns):
                continue
            for dim in sorted({d for d in dangerous if d in low}):
                findings.append({"path": rel.as_posix(), "line": lineno, "dimension": dim, "severity": "high", "reason": "potentially unbounded or sensitive dimension appears at telemetry-producing call site", "snippet": line.strip()[:240]})
            metric_markers = ("counter(", "histogram(", "gauge(", "create_counter", "create_histogram")
            dynamic_markers = ("f\"", "f'", "${", "+", "format(")
            if any(m in low for m in metric_markers) and any(m in low for m in dynamic_markers):
                findings.append({"path": rel.as_posix(), "line": lineno, "dimension": "<metric-name>", "severity": "high", "reason": "metric name may be dynamically constructed", "snippet": line.strip()[:240]})
    return findings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True); ap.add_argument("--config", required=True); ap.add_argument("--output", required=True)
    args = ap.parse_args()
    repo, cfg_path, output = Path(args.repo).resolve(), Path(args.config).resolve(), Path(args.output).resolve()
    if not repo.is_dir():
        print(f"repository directory not found: {repo}", file=sys.stderr); return 3
    try:
        cfg = load_config(cfg_path)
    except ValueError as exc:
        print(str(exc), file=sys.stderr); return 3
    findings = scan(repo, cfg)
    blocking = [f for f in findings if f["severity"] in set(cfg["blocking_severities"])]
    report = {"repository": str(repo), "finding_count": len(findings), "blocking_count": len(blocking), "findings": findings, "note": "Static findings are investigation leads and require contextual confirmation."}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"findings": len(findings), "blocking": len(blocking), "output": str(output)}))
    return 2 if len(blocking) > int(cfg["max_blocking_findings"]) else 0


if __name__ == "__main__":
    raise SystemExit(main())
