#!/usr/bin/env python3
"""Deterministic guard for agent-written executable control-plane configuration."""
from __future__ import annotations
import argparse, hashlib, json, pathlib, re, sys

RISKY_PATHS = [
    re.compile(r"(^|/)\.github/(agents|hooks|workflows)/", re.I),
    re.compile(r"(^|/)\.claude/", re.I),
    re.compile(r"(^|/)\.vscode/(tasks|settings)\.json$", re.I),
    re.compile(r"(^|/)(agents?|hooks?)/.*\.(json|ya?ml|md)$", re.I),
]
EXEC_KEYS = {"command", "commands", "hook", "hooks", "pretooluse", "posttooluse", "sessionstart", "shell", "run", "script"}
SHELL_RE = re.compile(r"\b(?:bash|sh|zsh|pwsh|powershell|cmd(?:\.exe)?|python\d*|node|curl|wget)\b|(?:&&|\|\||;)", re.I)

def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def risky_path(path: str) -> bool:
    p = path.replace("\\", "/").lstrip("./")
    return any(rx.search(p) for rx in RISKY_PATHS)

def walk(obj, trail=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            t = f"{trail}.{k}" if trail else str(k)
            yield k, v, t
            yield from walk(v, t)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f"{trail}[{i}]")

def indicators(text: str):
    out = []
    try:
        obj = json.loads(text)
    except json.JSONDecodeError:
        obj = None
    if obj is not None:
        for k, v, trail in walk(obj):
            if str(k).lower() in EXEC_KEYS:
                out.append(f"exec-key:{trail}")
                if isinstance(v, str) and SHELL_RE.search(v):
                    out.append(f"shell-value:{trail}")
    else:
        for line_no, line in enumerate(text.splitlines(), 1):
            low = line.lower()
            if any(re.search(rf"\b{re.escape(k)}\b\s*[:=]", low) for k in EXEC_KEYS) and SHELL_RE.search(line):
                out.append(f"command-like-line:{line_no}")
    return sorted(set(out))

def evaluate(path: str, text: str, approved_sha: str | None):
    sha = digest(text)
    inds = indicators(text)
    privileged = risky_path(path) or bool(inds)
    approved = bool(approved_sha and approved_sha.lower() == sha)
    block = privileged and not approved
    return {"decision": "BLOCK" if block else "ALLOW", "path": path, "sha256": sha,
            "privileged": privileged, "approved": approved, "indicators": inds,
            "reason": "privileged configuration requires content-bound approval" if block else "policy satisfied"}

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("path", help="repository-relative target path")
    ap.add_argument("content_file", help="file containing the proposed full content")
    ap.add_argument("--approved-sha256", default=None)
    args = ap.parse_args()
    try:
        text = pathlib.Path(args.content_file).read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        print(json.dumps({"decision":"ERROR","error":str(exc)}))
        return 2
    result = evaluate(args.path, text, args.approved_sha256)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 10 if result["decision"] == "BLOCK" else 0

if __name__ == "__main__":
    sys.exit(main())
