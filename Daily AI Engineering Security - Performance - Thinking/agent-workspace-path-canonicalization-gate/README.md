# Agent Workspace Path Canonicalization Gate

**Category:** Security

## Problem
Coding agents can cross intended workspace boundaries when different file-access paths, symlink handling, attachment preprocessing, or automatic-edit permission modes apply authorization before path canonicalization or use inconsistent enforcement layers.

## Evidence
Current public evidence is documented in `evidence/research.md`, including the August 11, 2026 VS Code Copilot Chat advisory, Cursor CVE-2026-50549, and a Claude Code parent-traversal permission-bypass report.

## Existing approach
Products commonly use workspace roots, sandbox path checks, deny rules, approval prompts, and path canonicalization.

## Existing limitations
Those controls become fragile when multiple file-access pipelines normalize paths differently, when canonicalization failure falls back to the original path, or when an auto-edit mode bypasses the workspace boundary.

## Proposed improvement
Use one deterministic authorization gate for every file access. Resolve/canonicalize the target first, reject resolution failure, then compare the resolved target against canonical workspace roots and deny rules. Treat symlink traversal and parent traversal identically regardless of access syntax.

## Package tree
- `evidence/research.md`
- `config/policy.json`
- `skills/path-boundary-analysis.md`
- `rules/workspace-boundary.md`
- `subagents/security-verifier.md`
- `workflows/diagnose-and-fix.md`
- `workflows/regression-verification.md`
- `hooks/pre-file-access.md`
- `scripts/path_gate.py`
- `tests/test_path_gate.py`

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` with canonical workspace roots and optional denied path prefixes. Never add broad roots merely to suppress a block.

## Usage
`python scripts/path_gate.py --policy config/policy.json --workspace /abs/project --target ./src/file.txt --operation write`

## Workflow
Observe → capture baseline access path → normalize/canonicalize → evaluate boundary → reproduce bypass → fix integration → rerun regression fixtures → independent verification.

## Metrics
Unauthorized path acceptance rate, canonicalization-failure fail-open count, symlink escape block rate, parent-traversal block rate, false-positive count, approval coverage for outside-workspace operations.

## Verification
Run `python -m unittest tests/test_path_gate.py`.

## Safety
The gate fails closed when canonicalization cannot prove the target is within an allowed root. It never reads file contents or secrets.

## Failure handling
Detection: non-zero exit or failing fixture. Evidence: resolved path and reason code only. Retry: maximum 2 implementation attempts. Fallback: disable auto-edit/write capability. Escalation: security review for any ambiguous root or symlink behavior. Stop on any proven outside-workspace write.

## Definition of Done
**Implemented:** one gate is used by every file-access path.  
**Measured:** baseline and post-fix fixtures are recorded.  
**Verified:** all tests pass, outside-workspace and symlink escapes are blocked, no secrets are exposed, and an independent reviewer confirms no bypass path remains.

## Customization
Extend operations and deny prefixes, but keep canonicalization-before-authorization and fail-closed semantics mandatory.
