# Skill — Revalidate Workspace State

## Purpose
Prevent an agent from executing a persistent plan against repository state that changed after the plan was formed.

## Trigger
Before resuming a paused/persisted task, applying an earlier plan, recovering after compaction/error, or whenever another actor may have modified the workspace.

## Inputs
Baseline checkpoint; current repository; active plan and assumptions; optional plan-critical paths.

## Preconditions
Git repository is readable and the baseline belongs to this task/repository.

## Required context
Current plan, explicit assumptions, prior verification conclusions, and changed areas only.

## Allowed tools
Read-only Git commands, file reads/search, and non-mutating tests/build checks.

## Constraints
Do not use hidden chain-of-thought. Record observable facts, assumptions, evidence, decisions, risks, and verification status.

## Procedure
1. Run deterministic `check` against the baseline.
2. If unchanged, record `workspace_validity=matched`.
3. If changed, collect HEAD/branch/status and changed paths.
4. Map each changed dimension to plan assumptions and prior test conclusions.
5. Mark assumptions `unaffected`, `needs-refresh`, or `invalid`, with evidence.
6. Reread only evidence needed to resolve affected assumptions.
7. Re-run affected tests/build observations.
8. Produce a revised plan or evidence-backed decision that the plan remains valid.
9. Capture a new baseline only after revalidation completes.

## Decision points
- HEAD/branch changed: inspect commit delta.
- Dirty/untracked path intersects plan-critical area: refresh the corresponding assumption.
- Dependency/lock/schema/migration change: invalidate related environment/build assumptions by default.
- Unrelated drift: document why and avoid a full rescan.

## Expected output
Facts; Changed state; Affected assumptions; Refreshed evidence; Decision; Risks; Verification status; new checkpoint identifier.

## Metrics
Revalidation latency, files reread, assumptions invalidated, stale actions prevented, full-rescan avoidance.

## Verification
The final plan references current evidence and the newest checkpoint. No material changed path remains unexplained.

## Failure handling
Retry a deterministic inspection failure once after remediation. Otherwise stop and escalate.

## Stop conditions
Stop when the workspace matches, or when all material drift is classified and affected assumptions are revalidated. Never repeatedly reread unchanged evidence.