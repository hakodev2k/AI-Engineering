#!/usr/bin/env python3
import json, subprocess, sys

def run(cmd):
    return subprocess.check_output(cmd, text=True).strip()

try:
    print(json.dumps({"git_revision": run(["git","rev-parse","HEAD"]), "status": run(["git","status","--short"])}, indent=2))
except Exception as exc:
    print(json.dumps({"error": str(exc)}))
    sys.exit(1)
