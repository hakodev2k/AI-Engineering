# Skill: Evidence-Backed Completion

## Purpose
Turn task completion from a prose assertion into a durable, observable requirement-to-evidence decision.

## Trigger
At task start or requirement change, after relevant implementation/validation events, and immediately before a terminal completion/success response.

## Inputs
User requirements, acceptance criteria, changed artifacts, validation commands/results, evidence sequence IDs, and explicit accepted exceptions.

## Preconditions
Material requirements are identifiable and externally observable evidence can be recorded without exposing hidden chain-of-thought.

## Required context
Current requirement ledger, latest relevant changes, test/build/lint/typecheck/runtime results, and unresolved blockers.

## Allowed tools
Repository inspection, test/build tools, CI/log reads, diff/status tools, `scripts/completion_gate.py`, schema validators.

## Constraints
- MUST NOT request or store hidden chain-of-thought.
- MUST distinguish implementation from verification.
- MUST NOT label a requirement `verified` solely because code exists or appears correct by inspection when executable verification is required.
- MUST invalidate evidence made stale by later relevant changes.
- MUST include failed/skipped/unavailable checks rather than hiding them.
- MUST distinguish focused checks from full regression coverage.

## Procedure
1. Extract each material deliverable/acceptance criterion into one durable requirement row.
2. Set initial status to `not_addressed`.
3. After implementation, update to `implemented_unverified` unless fresh verification evidence already exists.
4. Record every validation event as structured evidence with command/result scope, success, sequence, and relevant paths.
5. Map evidence IDs to the requirements they support.
6. On changes to relevant paths after evidence, mark or calculate that evidence stale.
7. Promote to `verified` only when fresh successful evidence supports the material claim.
8. Keep partial or blocked requirements explicit.
9. Before finalization, run `scripts/completion_gate.py` against the ledger.
10. If blocked, continue/re-plan within bounded retries or report incomplete/blocked status; do not emit success.
11. Generate the final completion report from the ledger rather than memory.

## Decision points
- Requirement is inherently non-executable: attach observable file/diff/review evidence appropriate to the claim.
- Focused test passes but broader claim is made: qualify the status/scope; do not overgeneralize.
- Required verification cannot run: status remains unverified/blocked unless the user explicitly accepts the exception.
- Relevant file changes after a pass: evidence becomes stale and must be refreshed.

## Expected output
A machine-readable ledger plus a concise final report showing each requirement status, supporting evidence, and uncertainty.

## Metrics
Evidence coverage, unsupported claims blocked, stale-evidence detections, premature-finalization blocks, rework after declared completion.

## Verification
Run positive and negative ledger fixtures through the deterministic completion gate. Independently inspect that each `verified` row has fresh successful evidence matching its scope.

## Failure handling
Malformed/missing evidence blocks verification; it never defaults to success. If evidence collection tooling fails, record that failure and retain unverified status.

## Stop conditions
Stop autonomous retries after two recovery cycles, on explicit cancellation, or when completion requires unavailable approval/environment. Return blocked/incomplete rather than falsely complete.
