# Skill: Checkpoint Recovery Analysis

## Purpose
Determine what expensive scan work is durably complete, what failed, and the smallest safe recovery scope.

## Trigger
A discovery/validation/report phase fails, a mandatory artifact is missing, finalization cannot consume existing artifacts, or an agent proposes rerunning a completed scope.

## Inputs
Scan id, target revision, terminal manifest, worker statuses, required-artifact contract, artifact directory, quota/cost state.

## Preconditions
Freeze the failed scan state. Do not launch replacement workers before evidence collection.

## Required context
Immutable target identity, phase boundaries, worker ids/attempts, expected artifacts, accepted outputs, failure kind, remaining budget.

## Allowed tools
Read-only filesystem inspection, hashing, manifest parsing, package checkpoint validator.

## Constraints
Do not fabricate missing artifacts. Do not mark a worker complete from narrative output alone. Do not weaken artifact requirements to recover quota.

## Procedure
1. Capture terminal manifest and immutable target revision.
2. Enumerate each completed/failed/canceled worker and its required outputs.
3. Validate artifact existence, non-empty content, and hashes.
4. Separate durable usable evidence from absent/corrupt/incomplete output.
5. Classify failure: worker-production, publication, coordinator-consumption, finalization, or orchestration-retry.
6. Determine minimal recovery scope: finalize-existing, rerun-one-worker, rerun-phase, or full restart.
7. Apply budget and approval policy before any expensive retry.
8. Produce a recovery decision with explicit stop condition.

## Decision points
- Canonical/report artifacts exist and hash correctly: prefer finalization repair over discovery rerun.
- One worker lacks required artifact but sibling checkpoints are valid: preserve siblings and rerun only failed worker if permitted.
- Target revision changed: prior checkpoint cannot authorize continuation without revalidation.
- Full restart requested after terminal failure: require explicit approval and budget gate.

## Expected output
Facts, preserved checkpoints, missing artifacts, failure class, minimal retry scope, budget decision, verification requirements.

## Metrics
Preserved-work ratio, retry-scope reduction, checkpoint validity, repeated deterministic failure count, wasted compute avoided.

## Verification
Recovery plan must reference only validated checkpoints and must not require repeating a phase whose inputs/artifacts remain valid.

## Failure handling
If target identity or artifact contract is unknown, classify recovery as blocked rather than guessing.

## Stop conditions
Stop after one recovery decision; if the same deterministic failure repeats twice, prohibit automatic retry and escalate.