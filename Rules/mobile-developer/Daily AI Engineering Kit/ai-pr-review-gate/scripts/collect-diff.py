#!/usr/bin/env python3
import subprocess
import sys


def main():
    try:
        result = subprocess.run(["git", "diff", "--stat"], capture_output=True, text=True, check=True)
        print(result.stdout)
        return 0
    except subprocess.CalledProcessError as exc:
        print(exc.stderr, file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
