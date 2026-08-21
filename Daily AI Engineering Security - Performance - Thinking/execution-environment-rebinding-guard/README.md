# Execution Environment Rebinding Guard

## Topic
Safe, verifiable rebinding of persisted AI-agent threads when the execution runtime or filesystem namespace changes.

## Category
Security

## Problem
Agent state can persist environment-sensitive values across SQLite, global state, rollout/world-state, sandbox policies, writable roots, shell metadata, host-skill paths, and project binding. Partial Windows-native/WSL migration can leave contradictory trust boundaries even when conversation content is intact.

## Evidence
See `evidence/research.md`. Current public reports show the failure in both Windows -> WSL and WSL -> Windows directions, plus history/project classification problems around WSL switching.

## Existing approach
Starting a new thread normally picks up the current environment; manual repair can rewrite persisted state; some surfaces normalize individual paths or allow thread movement/continuation.

## Existing limitations
These approaches do not guarantee cross-store atomicity, permission equivalence, canonical workspace identity, or independent post-migration verification.

## Proposed improvement
Represent rebinding as a security gate: inventory all structured environment bindings, apply only explicit mappings, reject mixed provenance or widened permissions, require backup, and block resume until deterministic and independent checks pass.

## Architecture
- Evidence: current failure signals and root-cause analysis.
- Skill: repeatable audit and decision procedure.
- Rules: enforceable security invariants.
- Subagent: independent verifier separated from the migration implementer.
- Workflow: bounded observe/diagnose/migrate/verify path.
- Hook: deterministic pre-resume block.
- Script + tests: read-only inspection of exported structured state.

## Package tree
```text
README.md
evidence/research.md
skills/rebinding-audit.md
rules/rebinding-security-rules.md
subagents/rebinding-verifier.md
workflows/rebind-and-verify.md
hooks/pre-resume-rebinding-check.md
scripts/rebinding_audit.py
tests/test_rebinding_audit.py
```

## Installation
Python 3.10+; no third-party packages.

## Configuration
Prepare three JSON files:

`state-export.json` — structured exported thread/global/rollout execution state.

`mapping.json`:
```json
{
  "path_map": [{"from": "/mnt/d/Projects/App", "to": "D:\\Projects\\App"}],
  "critical_keys": ["cwd", "root", "path", "sandbox", "writable", "permission", "workspace", "skill"]
}
```

`target-environment.json`:
```json
{
  "family": "windows",
  "workspace_root": "D:\\Projects\\App",
  "allowed_roots": ["D:\\Projects\\App"],
  "shell": "powershell"
}
```

## Usage
```bash
python scripts/rebinding_audit.py --state state-export.json --mapping mapping.json --target target-environment.json
python -m unittest tests/test_rebinding_audit.py
```

Exit code 0 means no blocking finding was detected by the configured audit. Exit code 1 means resume must be blocked. Exit code 2 means invalid inputs/configuration.

## Workflow
Follow `workflows/rebind-and-verify.md`: observe -> baseline -> diagnose -> explicit mapping -> backup -> implement -> measure -> independent verify -> resume preflight.

## Metrics
Critical/unmapped/mixed-runtime reference counts, stale permission roots, permission expansions, project-binding mismatch rate, resume success rate, rollback success rate.

## Verification
A package-level implementation is **Implemented** when the auditor, rules, workflow, hook, and tests exist. A real migration is **Measured** after pre/post audit reports are captured. It is **Verified** only when the independent verifier confirms zero blocking findings and target resume preflight succeeds without permission expansion.

## Safety
The included script is read-only. It does not edit SQLite, rollout files, global state, permissions, or process state. Actual migration must use a separate controlled component and a recoverable backup. Do not global-replace historical path strings in conversation prose.

## Failure handling
Detection: non-zero audit or verifier block. Evidence: exact JSON field paths and classifications. Retry: maximum two mapping-plan revisions. Fallback: keep source snapshot and target state offline; restore source when safe. Escalation: human review for ambiguous mapping or any required permission expansion. Stop: no backup, unresolved critical path, or two failed revisions.

## Definition of Done
- current evidence documented
- source baseline captured
- all environment-sensitive structured fields inventoried
- explicit mapping plan approved
- backup exists
- migration applied without partial state
- deterministic post-audit exits 0
- no unapproved permission expansion
- independent verifier passes
- target resume preflight succeeds
- rollback remains available until successful resume

## Customization
Extend `critical_keys`, target families, and path validators for containers, remote hosts, network mounts, or other sandboxes. Keep mappings explicit and preserve the fail-closed behavior for ambiguous permission state.