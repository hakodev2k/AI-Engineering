# Skill — Replay Contract Audit

## Purpose
Determine whether a failed/resumable agent task can be replayed without losing task-critical input.

## Trigger
Before enabling checkpoint retry or when a resumed task produces unexpected behavior.

## Inputs
Task schema, dispatch payload, checkpoint schema, retry handler, side effects.

## Preconditions
Read-only access to workflow definition and representative traces.

## Allowed tools
Source search, trace inspection, schema inspection, local deterministic scripts.

## Constraints
Do not run production side effects. Do not infer durability from variable names.

## Procedure
1. Enumerate task inputs at the dispatch boundary.
2. Mark each input as replay-critical or reconstructable/optional with evidence.
3. Map each critical field to a durable source.
4. Canonicalize critical values and compute a dispatch digest.
5. Simulate failure after dispatch but before successful completion.
6. Reconstruct the task from the actual checkpoint/retry path.
7. Compute resume digest and compare.
8. If any field is absent or changed, classify BLOCK and identify the missing durability edge.
9. Repeat once after remediation; stop after two failed reconstruction attempts.

## Decision points
PASS only when all required fields are present and semantically equivalent. BLOCK on missing fields, unproven reconstruction, or unexpected digest change.

## Expected output
Replay contract table, evidence, PASS/BLOCK status, remediation target.

## Metrics
Critical fields covered, reconstruction success rate, digest mismatch rate, blocked unsafe resumes.

## Verification
An independent verifier reruns the deterministic contract check from saved evidence.

## Failure handling
Escalate after two failed reconstruction attempts. Do not weaken required-field coverage.

## Stop conditions
PASS with independent verification, or BLOCK with explicit unrecoverable field/evidence.
