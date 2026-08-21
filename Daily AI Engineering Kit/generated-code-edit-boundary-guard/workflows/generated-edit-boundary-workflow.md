# Generated Edit Boundary Workflow

## Trigger
Any task that may modify files matching generated/vendor/derived indicators or any task with repository-wide edits.

## Entry conditions
- Repository readable.
- Current branch/HEAD known.
- Planned edit scope identifiable.

## Inputs
Task requirement, candidate paths, repository context, policy.

## Stages
1. **Detect boundaries** — Generated Source Resolver classifies target paths and produces the manifest.
2. **Checkpoint A** — run manifest validation. Any `unknown`, unresolved generated source, vendor target, or direct-edit requirement blocks normal execution.
3. **Plan source change** — implementation owner identifies the smallest authoritative source/config change.
4. **Approval checkpoint** — request human approval before direct generated/vendor exceptions, generator upgrades, destructive regeneration, public breaking changes, production/config/infra changes, or irreversible migrations.
5. **Execute source edit** — edit authoritative source only.
6. **Regenerate** — run the documented generator once. One retry is permitted only for a proven transient tool/environment failure; preserve first failure evidence.
7. **Inspect diff** — run `scripts/inspect-generated-diff.py` and relevant build/tests.
8. **Independent review** — Boundary Reviewer checks source→output causality, protected changes, unexpected churn, tests, and approvals.
9. **Final gate** — run `scripts/evaluate-generated-boundary-gate.py`.
10. **Complete** only when gate reports `verified`.

## Produced artifacts
- Boundary manifest
- Generated diff report
- Generation/build/test evidence
- Reviewer record
- Final gate result

## Checkpoints
- Before any edit
- Before exception-required action
- After regeneration
- Before completion/merge

## Retry rules
- Maximum generator retry: 1.
- Retryable: transient executable startup, temporary file lock, ephemeral network/tool fetch when dependency is already pinned.
- Not retryable: invalid schema/source, generator-version mismatch requiring upgrade, build/test regression, business-rule mismatch, unexplained churn.
- Preserve command, stdout/stderr, exit code, and diff from each attempt.

## Failure paths
- Unknown boundary → stop and escalate ownership discovery.
- Generator unavailable → stop; do not hand-edit output.
- Unexpected generated churn → stop and investigate generator inputs/version/environment.
- Permission failure → stop; do not increase permissions silently.
- Required approval missing → `human-approval-required`.

## Stop conditions
Any unresolved protected edit, unapproved exception, failed verification, or reviewer conflict.

## Definition of Done
- All changed paths classified.
- Protected changes map to authoritative source/regenerator or approved exception.
- No unexplained direct generated/vendor edit remains.
- Generator command evidence exists when regeneration occurred.
- Relevant build/tests pass.
- Independent review is complete.
- Final gate returns `verified`.
