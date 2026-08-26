# Skill: Evidence Freshness Analysis
## Purpose
Determine whether a verification claim is supported by fresh evidence for the exact current revision.
## Trigger
Before claiming done, verified, tests-passed, ready-to-merge, or equivalent.
## Inputs
Current revision; JSONL verification ledger; allowed freshness window; required verification command set.
## Preconditions
Repository revision is immutable for the duration of the check.
## Required context
Task acceptance criteria and required tests. Hidden chain-of-thought is neither requested nor recorded.
## Allowed tools
Read-only VCS inspection; deterministic ledger evaluator; approved test runners.
## Constraints
Evidence from a different revision MUST NOT satisfy the gate. A failing record newer than a passing record MUST block completion.
## Procedure
1. Capture the current revision.
2. Validate ledger records.
3. Select records matching the exact revision.
4. Identify the newest applicable record.
5. Check status and age.
6. Compare command coverage with task requirements.
7. Emit Facts, Evidence, Decision, Risks, Verification status.
8. Re-run verification only if evidence is missing/stale/failed, at most twice for an unchanged revision.
## Decision points
Allow completion only for fresh passing evidence; otherwise block with a machine-readable reason.
## Expected output
Gate decision plus evidence ID and stable evidence key.
## Metrics
Duplicate verification suppression; stale rejection count; exact-revision coverage; verification runs/task.
## Verification
Independent verifier confirms revision binding and command coverage.
## Failure handling
Fail closed on invalid ledger data or ambiguous revision.
## Stop conditions
Stop after two verification attempts for an unchanged revision; escalate persistent failures rather than looping.
