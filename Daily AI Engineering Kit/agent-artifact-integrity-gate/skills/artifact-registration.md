# Skill: Artifact Registration

## Purpose
Create a durable integrity record for an intermediate artifact before another agent or workflow stage consumes it.

## When to use
Use whenever a plan, analysis, report, generated patch, test result, schema, context bundle, migration plan, or other file is passed between agents or resumed later.

## Inputs
- Artifact path
- Task ID
- Repository identity
- Producer identity
- Artifact type
- Producer status
- Optional source artifact IDs
- Freshness TTL

## Preconditions
- Artifact exists and is readable.
- Artifact is final for the current producer stage.
- Producer can identify the task and repository scope.

## Required context
- Current task ID
- Repository root or repository identity
- Current commit/ref when available
- Applicable policy from `config/artifact-policy.json`

## Allowed tools
- File reads
- Git metadata reads
- Hashing scripts
- Deterministic validators

## Constraints
- Never infer provenance that is not known.
- Never mark an artifact `verified` merely because it was generated successfully.
- Do not register secrets or protected raw data unless explicitly allowed by repository policy.

## Process
1. Confirm the artifact exists and identify its canonical relative path.
2. Record producer, task ID, repository ID, artifact type, and creation timestamp.
3. Compute SHA-256 using `scripts/register-artifact.py`.
4. Record source artifact IDs when the artifact is derived from prior artifacts.
5. Bind the record to the current repository ref or commit when available.
6. Assign a TTL appropriate to the artifact type; do not exceed policy maximum.
7. Set `producer_status` to one of `executed`, `completed`, `blocked`, or `failed`.
8. Set integrity status to `registered`; do not self-promote to `verified`.
9. Save the record in the configured ledger directory.
10. Run `scripts/verify-artifact.py` against the artifact and record.
11. Hand off both artifact and integrity record to the independent verifier.

## Expected output
- Artifact file
- Integrity record conforming to `schemas/artifact-record.schema.json`
- Hash verification result

## Verification
Registration is valid only when the artifact exists, the stored SHA-256 matches current bytes, required provenance exists, TTL is within policy, and task/repository binding is present.

## Failure handling
- Missing artifact: stop immediately.
- Hash failure: retry hashing once; if repeated, stop.
- Missing provenance: mark `blocked` and request required context.
- Policy violation: do not relax policy automatically.

## Stop conditions
Stop if the artifact cannot be bound to a task/repository, if its bytes change during registration, or if policy forbids the artifact type.