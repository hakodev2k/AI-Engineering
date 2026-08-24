# Skill — Resume Freshness Analysis

## Purpose
Decide whether persisted agent work is current enough to resume autonomously after restart, recovery, or upgrade.

## Trigger
Any pending session, delegation completion, checkpoint, or synthetic resume turn about to become model-visible active work.

## Inputs
Resume envelope, freshness policy, current workspace/external-state identifiers, side-effect classification.

## Preconditions
The system can distinguish real user/task activity timestamps from storage-maintenance timestamps.

## Required context
Original task identity, last real activity, prior terminal state, outstanding side effects, approvals, persisted delivery state, and current time.

## Allowed tools
Read-only state/database inspection, `scripts/check_resume_freshness.py`, repository/workspace identity checks.

## Constraints
- MUST NOT use generic `updated_at` alone as proof of recency.
- MUST NOT execute model/tool actions during classification.
- MUST NOT treat `pending` delivery as current intent.
- MUST require re-approval for stale side-effect-capable work.

## Procedure
1. Identify immutable/semantic activity timestamp (`last_real_activity_at`).
2. Compute age using current trusted clock.
3. Inspect prior terminal state: completed/cancelled/failed states are not auto-resumable unless a new explicit task exists.
4. Determine whether pending work can cause external or repository mutations.
5. Verify persisted origin and task/session identity.
6. If age exceeds policy, quarantine.
7. If recent but workspace/external preconditions changed, quarantine pending revalidation.
8. If recent, interrupted, nonterminal, provenance-complete, and policy-safe, allow.
9. Record reason codes and evidence hash.

## Decision points
- Missing provenance → quarantine.
- Maintenance timestamp newer than last real activity → ignore maintenance time for freshness.
- Historical completion delivered after long delay → reference-only unless explicitly reactivated.
- Prior terminal task → deny autonomous resume.

## Expected output
Structured decision with age, provenance completeness, terminal-state check, side-effect risk, decision, reasons, and required approvals.

## Metrics
Decision coverage, stale blocks, false-positive quarantines, provenance-missing rate, side-effect reapproval rate.

## Verification
Use fixtures covering recent interruption, stale pending completion, refreshed storage timestamp, terminal task, and missing provenance.

## Failure handling
If clock parsing or provenance is ambiguous, quarantine rather than infer freshness.

## Stop conditions
Stop when a deterministic decision is produced, when human approval is required, or when required provenance cannot be recovered.
