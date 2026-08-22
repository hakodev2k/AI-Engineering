#!/usr/bin/env python3
import argparse, subprocess, sys

def changed_files():
    proc = subprocess.run(["git", "diff", "--name-only", "HEAD"], capture_output=True, text=True)
    if proc.returncode != 0:
        print(proc.stderr.strip(), file=sys.stderr)
        raise SystemExit(2)
    return [x.strip() for x in proc.stdout.splitlines() if x.strip()]

def main():
    parser = argparse.ArgumentParser(description="Fail if Git diff contains files outside approved scope")
    parser.add_argument("--allowed-file", action="append", default=[])
    args = parser.parse_args()
    allowed = set(args.allowed_file)
    if not allowed:
        print("ERROR: at least one --allowed-file is required", file=sys.stderr)
        return 2
    changed = changed_files()
    unexpected = [p for p in changed if p not in allowed]
    if unexpected:
        print("ERROR: unexpected changed files:", file=sys.stderr)
        for p in unexpected: print(f" - {p}", file=sys.stderr)
        return 1
    print(f"PASS: {len(changed)} changed file(s) are within approved scope")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
