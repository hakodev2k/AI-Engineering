# Sandbox Path Rebinding Integrity Gate

## Category
Security

## Problem
Agent sessions persist execution-environment paths in multiple security-relevant stores. When Windows-native and WSL namespaces are switched, partial rebinding can leave `cwd`, writable roots, sandbox paths, permission profiles, and rollout state inconsistent. Public evidence shows broken sessions; this package treats filesystem-authority migration as a fail-closed integrity boundary without claiming an observed privilege escalation.

## Evidence
See `evidence/research.md`. The primary independent signals are openai/codex#38781 (WSL→Windows) and #36608 (Windows→WSL), both documenting stale/malformed path and permission/sandbox state.

## Existing approach and limitations
Fresh sessions initialize the correct destination environment. Manual replacements can recover old sessions, while move/continue actions preserve conversation context. These approaches can leave environment-specific policy state distributed across SQLite, global JSON, rollout records, shell metadata, and permission structures.

## Proposed improvement
Inventory all security-relevant paths, use explicit source→destination mappings, canonicalize into approved destination roots, reject mixed/unmapped/outside-root paths, stage migration with backup, independently verify authority, then commit atomically.

## Architecture
- `evidence/research.md` — evidence, limitations, root causes.
- `skills/path-rebinding-threat-model.md` — reusable security analysis.
- `rules/sandbox-root-migration-rules.md` — enforceable migration rules.
- `subagents/migration-auditor.md` — pre-migration auditor.
- `subagents/security-verifier.md` — independent verifier.
- `workflows/preflight-migrate-verify.md` — bounded migration workflow.
- `hooks/pre-commit-root-consistency.md` — deterministic blocking hook.
- `config/path-map.example.json` — explicit mapping/allow/protect configuration.
- `scripts/path_rebinding_audit.py` — read-only canonicalization/containment auditor.
- `tests/test_path_rebinding_audit.py` — regression tests.

## Installation
Python 3.10+; standard library only. Export path-bearing state into the documented JSON shape before running the auditor. Do not point the script at live databases; it intentionally consumes a read-only export.

## Configuration
Copy `config/path-map.example.json` and replace sample roots with explicit mappings for the target machine. Do not infer mappings for Linux-native WSL paths or unknown mounts.

## State input shape
`{"paths":[{"kind":"cwd","logical_id":"project-a","store":"sqlite","value":"/mnt/d/Work/App"}]}`

Use the same `logical_id` for representations that must resolve to the same canonical target across stores.

## Usage
`python scripts/path_rebinding_audit.py staged-state.json --config config/path-map.example.json --pretty`

Exit codes: `0` allow staging/commit gate, `1` security/path violation, `2` invalid input/config.

## Workflow
Inventory → map explicitly → create backup → transform a staged copy/transaction → run deterministic audit → independent security verification → commit → inside-root and denied-outside-root smoke tests. Only one corrected retry is allowed.

## Metrics
Mixed-namespace roots, unmapped roots, outside-approved roots, protected-root overlaps, cross-store mismatches, permission-root delta, denied-outside-root result, migration/rollback rate.

## Verification
Run `python -m unittest tests/test_path_rebinding_audit.py`. For a real migration, verify every path-bearing store and run a destination-runtime smoke test showing expected access inside the project and continued denial outside approved roots.

## Safety
The auditor is read-only. Migration MUST NOT broaden writable roots, disable sandbox enforcement, guess path mappings, or commit without a backup. Unknown identity is a blocking result.

## Failure handling
Detection is deterministic through namespace, mapping, containment, protected-root, and cross-store checks. Preserve the original state, record evidence, correct at most once, then escalate. A failed post-commit security smoke test requires rollback.

## Definition of Done
**Implemented:** mapping rules, auditor, workflow, verifier separation, hook, tests, and evidence exist. **Measured:** all security-relevant path representations are inventoried and zero unexpected authority deltas are recorded. **Verified:** staged and committed states converge to approved roots, tests pass, inside-root operation works, outside-root access remains denied, and rollback evidence remains available until acceptance.

## Customization
Add collectors for specific SQLite/global-state/rollout schemas, but keep transformation separate from audit. Extend protected-root policies for organization-specific secrets, system paths, production mounts, or repository boundaries.