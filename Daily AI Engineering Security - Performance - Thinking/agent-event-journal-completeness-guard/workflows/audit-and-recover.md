# Workflow: Audit and Recover Durable Agent Evidence

## Trigger
Run completion, crash, resume request, audit export, or suspected transcript loss.

## Goal
Prevent incomplete durable evidence from being mistaken for a verified execution history.

## Inputs
Journal, optional authoritative mirror, session metadata.

## Baseline
A healthy canonical fixture in `schemas/event-record.schema.json` terms: unique monotonic events, closed tool lifecycles, exactly one terminal completion, mirror parity when enabled.

## Stages
1. **Observe** — preserve original journal/mirror and capture hashes.
2. **Measure baseline** — run auditor; record violation counts.
3. **Diagnose** — classify loss versus malformed ordering/lifecycle versus incomplete termination.
4. **Form hypothesis** — identify one persistence boundary likely responsible; do not infer missing payloads.
5. **Recover** — only from authoritative retained mirror/source into a new artifact.
6. **Measure again** — re-run the auditor.
7. **Verify** — independent Journal Verifier checks hashes, parity and lifecycle closure.
8. **Resume/complete** — only after pass; otherwise block/escalate.

## Responsible agent
Runtime operator performs capture/recovery; Journal Verifier performs final verification.

## Tools
`scripts/audit_event_journal.py`, immutable copy/hash utilities, product-specific export tools that do not mutate source evidence.

## Outputs
Original evidence hashes, audit JSON, optional recovered journal, independent verification decision.

## Checkpoints
Before recovery, after each recovery attempt, before resume/completion.

## Metrics
Missing events, extra events, orphan calls/results, sequence/duplicate violations, recovery attempts and success.

## Retry policy
At most two recovery attempts. A parse/environment failure can be retried once after correcting the non-evidence problem.

## Stop conditions
Audit pass or two unsuccessful recovery attempts.

## Failure path
Preserve evidence; mark session `incomplete`; do not resume from it automatically; escalate to runtime owner.

## Verification
Independent verifier reruns the same deterministic audit and confirms the recovery source was authoritative.

## Definition of Done
Implemented: capture/audit gate exists. Measured: audit report recorded. Verified: parity/lifecycle checks pass independently, or incomplete state blocks unsafe resume/completion.
