# Skill: Event Journal Audit

## Purpose
Determine whether durable agent evidence is structurally complete enough for verification, resume or replay.

## Trigger
Run completion, abnormal termination, resume/replay, transcript export, or persistence-layer/client upgrade.

## Inputs
Canonical durable journal JSONL, optional authoritative write-ahead mirror, runtime/session identifier and retention policy.

## Preconditions
Event IDs are assigned before persistence fan-out. Tool calls/results retain a stable `tool_use_id`. Sensitive content may be redacted, but identity/lifecycle metadata required for integrity MUST remain.

## Required context
Expected terminal state and whether the mirror is configured as authoritative.

## Allowed tools
Read-only journal access, `scripts/audit_event_journal.py`, deterministic hashes/metadata queries.

## Constraints
MUST NOT infer missing assistant content. MUST NOT manufacture tool results to make a journal close. MUST NOT expose hidden chain-of-thought. Redacted thinking content is outside the completeness requirement unless the host explicitly journals a non-sensitive event envelope for it.

## Procedure
1. Freeze/copy the candidate journal so diagnosis does not mutate evidence.
2. Validate parseability and canonical fields.
3. Check strictly increasing sequence numbers and unique event IDs.
4. Check each tool use has exactly one later result and no result precedes/appears without its use.
5. Require exactly one final completion record for a successful run.
6. If a write-ahead mirror exists, compare event-ID sets; any missing or unexplained event blocks verified status.
7. Classify violations as persistence loss, lifecycle violation, malformed evidence or incomplete termination.
8. Attempt recovery only from authoritative retained sources, maximum two attempts.
9. Re-audit recovered output independently.

## Decision points
Pass: allow verified completion/resume. Fail with authoritative missing source: preserve and block. Fail with recoverable mirror: rebuild a separate recovered journal, retain original, then re-audit.

## Expected output
Audit JSON containing pass/fail, violation codes, counts and evidence references.

## Metrics
Incomplete-run rate, missing event count, orphan call/result count, duplicate IDs, recovery success rate.

## Verification
A different agent/operator runs the auditor over the final immutable artifact.

## Failure handling
Never overwrite the damaged source. Maximum two recovery attempts. Escalate if authoritative events are unavailable or parity still fails.

## Stop conditions
Integrity pass or two failed recovery attempts; no infinite replay.
