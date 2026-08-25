# Skill: Cold-Cache Context Triage

## Purpose
Determine whether a long-context session can safely continue, should compact, or must export durable state and fork before recovery becomes impossible.

## Trigger
Run before expensive turns at or above the configured warning region, after cache health changes materially, or after transport failure in a long-context session.

## Inputs
Telemetry JSON, model/provider context limits, cache metrics when available, recent request errors, pending side effects, and recovery-reserve requirement.

## Preconditions
Telemetry must refer to the same active session and provider path. Do not merge child-agent telemetry into the parent context estimate.

## Required context
Current goal, unresolved tasks, approvals, workspace identity, pending tool operations, and verification state must be available if evacuation may occur.

## Allowed tools
Read-only telemetry/log access, deterministic token/accounting utilities, and creation of a non-secret state export.

## Constraints
MUST NOT clear history automatically. MUST NOT infer cache health from prior success. MUST NOT retry a repeatable oversized request indefinitely.

## Procedure
1. Capture context tokens, standard/max limits, and reserve.
2. Record cache hit ratio and age; mark cache state unknown if unavailable.
3. Count recent matching transport failures.
4. Run `scripts/context_recovery_guard.py`.
5. For `compact`, compact only while the transport path remains healthy.
6. For `export-and-fork`, persist goal, facts, decisions, pending work, approvals, workspace state, and verification status outside the transcript.
7. Independently verify the export before creating a fresh context.
8. Re-measure after recovery.

## Decision points
Healthy below thresholds: allow. High occupancy with healthy recovery path: compact. Oversized context plus cold/unknown cache and repeated failures: export-and-fork. Insufficient reserve or unsafe missing state: block.

## Expected output
Action, reasons, measured state, and required recovery evidence.

## Metrics
Context utilization, cache hit ratio, failed requests, retries avoided, recovery latency, tokens/task, and post-recovery regression rate.

## Verification
The same telemetry and policy must reproduce the same action. Imported fresh-context state must match the export before mutations resume.

## Failure handling
Refresh telemetry at most twice. If export completeness cannot be proven, stop and escalate.

## Stop conditions
Stop after a safe action is selected and verified, or immediately when state cannot be preserved.
