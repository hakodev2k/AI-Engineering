# Workflow: Failure Recovery

## Trigger
Resume/fork/render exceeds memory, latency, or storage budget.

## Goal
Recover without deleting required session state.

## Detection
Profiler BLOCK, OOM, timeout, excessive RSS, or payload-limit error.

## Evidence
Keep profiler JSON, peak RSS, elapsed time, and runtime error text.

## Retry policy
Maximum 2 retries total.

## Fallback
Prefer supported compact/export/new-session handoff preserving the active goal and required artifacts. Avoid raw transcript surgery unless explicitly approved and product-documented.

## Escalation
If recovery requires deleting durable data or weakening correctness/security, require human approval.

## Stop condition
Stop when a safe bounded session resumes or no safe recovery exists.

## Verification
Re-profile and independently validate required-context retention.