# Workflow: Safe Move and Overwrite

## Trigger
Agent proposes a destructive local/repository mutation.

## Goal
Complete the requested change without losing pre-existing data.

## Inputs
Plan JSON and workspace.

## Baseline
Capture source inventory, SHA-256 where required, Git status, and canonical paths.

## Stages
1. **Observe** — record exact request and current state.
2. **Measure baseline** — run `preflight`.
3. **Diagnose** — explain every block from structured output.
4. **Form hypothesis** — define the smallest staged, non-destructive change.
5. **Implement improvement** — implementer stages/copies destination while retaining source.
6. **Measure again** — run `verify`.
7. **Improved?** If no, correct plan/state and retry at most twice; source remains intact.
8. **Independent verification** — verifier confirms evidence.
9. **Approval** — obtain explicit approval if final removal is irreversible.
10. **Complete** — perform only the approved final cleanup and read back resulting state.

## Responsible agent
Implementer owns staging; independent verifier owns verification; human owns irreversible approval.

## Tools
Guard script, read-only Git/filesystem tools, host mutation tools only after relevant gates.

## Outputs
Preflight report, verification report, final evidence record.

## Checkpoints
Before staging; before source removal; after final cleanup.

## Metrics
Hash coverage, blocked unsafe attempts, verification pass rate, recovery count.

## Retry policy
Maximum 2 retries, only after evidence changes.

## Stop conditions
Path mismatch, missing source, dirty overwrite target, unverified destination, denied/missing approval.

## Failure path
Preserve source, emit evidence, escalate.

## Definition of Done
Preflight passed; destination verified; independent verifier accepted; approval present if needed; final state read back.