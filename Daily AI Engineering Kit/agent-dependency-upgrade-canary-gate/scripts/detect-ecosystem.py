#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

MARKERS = {
    "dotnet": ["*.sln", "*.slnx", "*.csproj", "Directory.Packages.props", "packages.lock.json"],
    "npm": ["package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"],
    "python": ["pyproject.toml", "requirements.txt", "poetry.lock", "Pipfile", "Pipfile.lock"],
}

IGNORED = {".git", "node_modules", "bin", "obj", ".venv", "venv", "dist", "build"}


def discover(root: Path):
    result = {key: [] for key in MARKERS}
    for ecosystem, patterns in MARKERS.items():
        seen = set()
        for pattern in patterns:
            for path in root.rglob(pattern):
                if any(part in IGNORED for part in path.relative_to(root).parts):
                    continue
                rel = path.relative_to(root).as_posix()
                if rel not in seen:
                    seen.add(rel)
                    result[ecosystem].append(rel)
        result[ecosystem].sort()
    return result


def main():
    parser = argparse.ArgumentParser(description="Detect dependency ecosystems from repository files.")
    parser.add_argument("--root", default=".", help="Repository root")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    if not root.is_dir():
        raise SystemExit(f"Repository root does not exist: {root}")
    found = discover(root)
    active = [name for name, files in found.items() if files]
    print(json.dumps({"root": str(root), "ecosystems": active, "files": found}, indent=2))
    return 0 if active else 2


if __name__ == "__main__":
    raise SystemExit(main())
