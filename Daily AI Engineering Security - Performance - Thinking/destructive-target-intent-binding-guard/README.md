# Destructive Target Intent-Binding Guard

## Topic
Bind destructive filesystem operations to exact authorized targets before execution.

## Category
Security

## Problem
Current coding agents can turn narrow cleanup intent into broad deletion through malformed paths, wildcard/broad cleanup mechanisms, recursive operations, or delegated-worker substitutions. Recent August 2026 incidents span Codex and Claude Code and include deletion outside the intended project scope.

## Evidence
See `evidence/research.md` for observed public incidents, existing approaches, remaining limitations, root causes, and sources.

## Existing approach and limitation
Sandboxes, approval prompts, command allow/deny rules, prompt instructions, version control, and backups all help, but none proves that the effective destructive target set equals the authorized task target set. Full-access workflows and delegated workers make this gap especially material.

## Proposed improvement
Require a structured destructive-operation contract before execution. A deterministic validator canonicalizes candidate targets, rejects ambiguous expressions and out-of-bound targets, checks exact authorization binding, and forces review for recursive or unrecoverable operations. Shell-specific adapters must translate proposed actions into this structure without executing them.

## Architecture
```text
README.md
evidence/research.md
config/policy.json
skills/destructive-target-preflight.md
rules/destructive-action-boundary.md
subagents/security-verifier.md
workflows/preflight-execute-verify.md
hooks/pre-destructive-command.md
scripts/target_guard.py
tests/test_target_guard.py
```

## Installation
Requires Python 3.10+ and only the standard library. Copy this directory intact.

## Configuration
Edit `config/policy.json` only through normal review. Keep exact target binding and allowed-root enforcement enabled. A host may choose stricter handling for recursive/unrecoverable operations but must not turn blocked findings into automatic allow.

## Usage
Create a request such as:
```json
{
  "operation": "delete",
  "cwd": "/workspace/project",
  "allowed_roots": ["/workspace/project"],
  "authorized_targets": ["/workspace/project/build/cache.tmp"],
  "targets": ["/workspace/project/build/cache.tmp"],
  "recursive": false,
  "recoverable": true
}
```
Then run:
```text
python scripts/target_guard.py --input request.json --policy config/policy.json --output decision.json
```
Exit codes: `0` allow, `20` block, `21` review, `2` invalid input.

## Workflow
Follow `workflows/preflight-execute-verify.md`: Observe → baseline → diagnose → narrow/remediate → remeasure → execute → independently verify. Remediation is bounded to two attempts.

## Metrics
Track decision counts, finding codes, unexpected postcondition changes, remediation attempts, false positives, and destructive data-loss incidents after an allow.

## Verification
Run:
```text
python -m unittest tests/test_target_guard.py
```
The suite covers exact-target allow, unauthorized targets, outside-root targets, ambiguous target expressions, recursive review, recursive allowed-root blocking, and unrecoverable-operation review.

### Status semantics
- **Implemented:** package files and deterministic validator exist.
- **Measured:** the regression fixtures have been executed and decisions recorded.
- **Verified:** all tests pass and an independent verifier confirms postconditions for an executed integration case.

## Safety
The validator never deletes files or evaluates shell syntax. It canonicalizes path strings only. Human approval is required before dangerous/irreversible reviewed operations. Full-access mode is not destructive authorization.

## Failure handling
Detection is any non-zero guard exit, unexpected postcondition, or verifier rejection. Preserve evidence and stop mutation. Retry command/operation narrowing at most twice before escalation. Never broaden roots, disable the guard, or weaken verification to make a failure disappear.

## Definition of Done
Evidence documented; current approaches and limitations identified; exact task targets captured; baseline captured; guard passes or reviewed approval is recorded; execution changes only authorized targets; tests pass; metrics captured; risks documented; independent verification complete; no blocking issue remains.

## Customization
Add platform adapters that emit the same structured request. Keep the core invariant: authorization is attached to exact canonical targets, not to prose intent, command names, or inherited agent permissions.
