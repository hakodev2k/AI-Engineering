#!/usr/bin/env python3
import subprocess
import json


def run(command):
    result = subprocess.run(command, shell=True, text=True, capture_output=True)
    return {"exit_code": result.returncode, "stdout": result.stdout, "stderr": result.stderr}

print(json.dumps({"git_status": run("git status --short"), "changed_files": run("git diff --name-only")}, indent=2))
