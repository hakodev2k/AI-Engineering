#!/usr/bin/env python3
import os
import subprocess
import sys

missing = []
git_check = subprocess.run(
    ["git", "rev-parse", "--is-inside-work-tree"],
    capture_output=True,
    text=True,
    check=False,
)
if git_check.returncode != 0 or git_check.stdout.strip() != "true":
    missing.append("Git working tree")
if not os.path.isfile("README.md"):
    missing.append("README.md")
if missing:
    print("Missing:", ", ".join(missing))
    sys.exit(1)

print("Repository validation passed")
