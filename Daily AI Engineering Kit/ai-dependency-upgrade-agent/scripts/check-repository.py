#!/usr/bin/env python3
import subprocess
import sys

try:
    result = subprocess.run(
        ['git', 'status', '--porcelain'],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or 'git status failed'
        print(detail)
        sys.exit(1)
    if result.stdout.strip():
        print('repository has changes')
        sys.exit(1)
    print('repository ready')
except (OSError, subprocess.SubprocessError) as exc:
    print(exc)
    sys.exit(1)
