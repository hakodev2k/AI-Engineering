#!/usr/bin/env python3
import subprocess
import sys

checks = [["git", "diff", "--stat"], ["git", "status", "--short"]]

for command in checks:
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr)
        sys.exit(result.returncode)
    print(result.stdout)

sys.exit(0)
