#!/usr/bin/env python3
import argparse
import json
import subprocess
import sys
from pathlib import Path

KNOWN_DEP_FILES = {
    'package.json','package-lock.json','npm-shrinkwrap.json','yarn.lock','pnpm-lock.yaml',
    'packages.lock.json','Directory.Packages.props','Directory.Build.props','global.json',
    'pom.xml','build.gradle','build.gradle.kts','gradle.lockfile',
    'requirements.txt','requirements-dev.txt','pyproject.toml','poetry.lock','Pipfile','Pipfile.lock',
    'go.mod','go.sum','Cargo.toml','Cargo.lock','composer.json','composer.lock','Gemfile','Gemfile.lock'
}


def run_git(args):
    result = subprocess.run(['git', *args], text=True, capture_output=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or 'git command failed')
    return result.stdout


def is_dependency_file(path):
    p = Path(path)
    return p.name in KNOWN_DEP_FILES or p.suffix in {'.csproj','.fsproj','.vbproj'}


def main():
    parser = argparse.ArgumentParser(description='Collect changed dependency files without modifying the repository.')
    parser.add_argument('--base', default='HEAD~1')
    parser.add_argument('--output', default='dependency-diff.json')
    args = parser.parse_args()

    try:
        run_git(['rev-parse', '--show-toplevel'])
        names = [x for x in run_git(['diff', '--name-only', f'{args.base}...HEAD']).splitlines() if x.strip()]
        dep_files = sorted([p for p in names if is_dependency_file(p)])
        payload = {
            'base_ref': args.base,
            'changed_files': sorted(names),
            'dependency_files': dep_files,
            'dependency_file_count': len(dep_files)
        }
        Path(args.output).write_text(json.dumps(payload, indent=2) + '\n', encoding='utf-8')
        print(json.dumps(payload, indent=2))
    except Exception as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        return 2
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
