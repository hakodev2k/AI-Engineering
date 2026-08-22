#!/usr/bin/env python3
import argparse, json, os, re, sys
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read JSON {path}: {exc}", file=sys.stderr)
        sys.exit(2)


def ignored(path: Path, root: Path, ignored_paths):
    rel = path.relative_to(root).as_posix()
    parts = set(path.relative_to(root).parts)
    for item in ignored_paths:
        item = item.strip("/")
        if not item:
            continue
        if item in parts or rel == item or rel.startswith(item + "/"):
            return True
    return False


def main():
    parser = argparse.ArgumentParser(description="Scan repository references for feature flag keys")
    parser.add_argument("--root", default=".")
    parser.add_argument("--records", required=True)
    parser.add_argument("--policy", default=os.getenv("FEATURE_FLAG_POLICY", "config/feature-flag-policy.json"))
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"ERROR: root does not exist or is not a directory: {root}", file=sys.stderr)
        return 2

    records = load_json(Path(args.records))
    policy = load_json(Path(args.policy))
    flags = records.get("flags")
    if not isinstance(flags, list):
        print("ERROR: records must contain flags[]", file=sys.stderr)
        return 2

    extensions = set(policy.get("scan_extensions", []))
    ignored_paths = policy.get("ignored_paths", [])
    pattern_templates = policy.get("lookup_patterns", ["{key}"])

    compiled = {}
    for flag in flags:
        key = flag.get("key")
        if not isinstance(key, str) or not key:
            continue
        patterns = []
        for template in pattern_templates:
            expression = template.replace("{key}", re.escape(key))
            try:
                patterns.append(re.compile(expression))
            except re.error as exc:
                print(f"ERROR: invalid lookup pattern for {key}: {exc}", file=sys.stderr)
                return 2
        compiled[key] = patterns

    references = {key: [] for key in compiled}
    skipped = []
    scanned_files = 0

    for path in root.rglob("*"):
        if not path.is_file() or ignored(path, root, ignored_paths):
            continue
        if extensions and path.suffix.lower() not in extensions:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError) as exc:
            skipped.append({"path": path.relative_to(root).as_posix(), "reason": str(exc)})
            continue
        scanned_files += 1
        rel = path.relative_to(root).as_posix()
        lines = text.splitlines()
        for key, patterns in compiled.items():
            for number, line in enumerate(lines, start=1):
                if any(pattern.search(line) for pattern in patterns):
                    references[key].append({"path": rel, "line": number, "excerpt": line.strip()[:240]})

    violations = []
    summaries = []
    for flag in flags:
        key = flag.get("key")
        if key not in references:
            continue
        refs = references[key]
        state = flag.get("state")
        summaries.append({"key": key, "state": state, "reference_count": len(refs), "references": refs})
        if state == "retired" and refs:
            violations.append({"key": key, "rule": "retired-flag-still-referenced", "count": len(refs)})
        if state in {"rolling-out", "stable", "retirement-ready"} and not refs:
            violations.append({"key": key, "rule": "active-flag-has-no-references", "count": 0})

    report = {
        "version": 1,
        "root": str(root),
        "scanned_files": scanned_files,
        "flags": summaries,
        "violations": violations,
        "skipped_files": skipped,
        "status": "fail" if violations else "pass"
    }

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Scanned {scanned_files} file(s); {len(violations)} violation(s); report={output}")
    if skipped:
        print(f"WARNING: skipped {len(skipped)} unreadable file(s)")
    return 10 if violations else 0


if __name__ == "__main__":
    sys.exit(main())