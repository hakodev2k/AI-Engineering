#!/usr/bin/env python3
from pathlib import Path
import json, re, sys

REQUIRED_FILES = [
    'README.md',
    'checklists/definition-of-done.md',
    'config/role-config.yaml',
    'examples/risk-register.example.json',
    'examples/security-review-request.example.json',
    'hooks/lifecycle-hooks.md',
    'knowledge/identity-api-security-playbook.md',
    'knowledge/security-engineering-principles.md',
    'rules/operating-rules.md',
    'schemas/security-review-request.schema.json',
    'scripts/validate-package.py',
    'scripts/validate-risk-register.py',
    'skills/secure-architecture-review.md',
    'skills/secure-code-review.md',
    'skills/security-incident-support.md',
    'skills/threat-modeling.md',
    'skills/vulnerability-triage.md',
    'subagents/cloud-identity-reviewer.md',
    'subagents/code-security-reviewer.md',
    'subagents/security-verifier.md',
    'subagents/threat-researcher.md',
    'templates/security-handoff.md',
    'templates/threat-model.md',
    'workflows/feature-security-review.md',
    'workflows/security-incident-support.md',
    'workflows/vulnerability-remediation.md',
]

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors=[]
    for f in REQUIRED_FILES:
        path = root / f
        if not path.is_file(): errors.append(f'missing file: {f}')
        elif path.stat().st_size == 0: errors.append(f'empty file: {f}')
    for path in root.rglob('*.json'):
        try: json.loads(path.read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError) as error: errors.append(f'invalid JSON: {path.relative_to(root)}: {error}')
    for md in root.rglob('*.md'):
        text=md.read_text(encoding='utf-8')
        for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
            if '://' in target or target.startswith('#'): continue
            p=(md.parent/target.split('#',1)[0]).resolve()
            if target and not p.exists(): errors.append(f'broken link: {md.relative_to(root)} -> {target}')
    if errors:
        for e in errors: print(e, file=sys.stderr)
        return 1
    print(f'package validation passed: {len(REQUIRED_FILES)} required files and local JSON checked')
    return 0

if __name__ == '__main__': raise SystemExit(main())
