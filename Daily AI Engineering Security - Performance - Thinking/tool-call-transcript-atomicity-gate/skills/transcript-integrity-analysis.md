# Skill: Transcript Integrity Analysis

## Purpose
Diagnose and safely recover agent sessions whose persisted tool-call lifecycle is incomplete or inconsistent.

## Trigger
Missing tool output error; interrupted long-running turn; gateway/app-server restart; provider rejects call/result pairing; resume repeatedly fails; compaction/replay changes tool history.

## Inputs
Original transcript/journal, process logs, tool execution logs, checkpoint metadata, side-effect/idempotency information.

## Preconditions
Preserve the original transcript read-only. Obtain approval before interacting with production systems or re-running side-effecting tools.

## Required context
Observable call IDs, event order, tool identity, execution status if durably known, and whether each tool is idempotent/reversible.

## Allowed tools
Read-only transcript/log inspection, `scripts/transcript_guard.py`, source/config inspection, test fixtures.

## Constraints
Do not request hidden chain-of-thought. Do not invent missing outputs. Do not infer successful execution from a call event alone.

## Procedure
1. Copy/preserve the original transcript and record a checksum outside any repair path if available.
2. Run validator and capture unresolved, orphan, and duplicate IDs.
3. For each unresolved call, classify Facts, Evidence, Assumptions, Side-effect risk, and Recovery decision.
4. If no durable result exists, mark it `cancel` in a repaired copy rather than fabricating a result.
5. If durable external evidence proves a result, use an adapter-specific restoration process with source provenance; do not guess content.
6. Revalidate repaired copy.
7. Decide whether re-execution is safe: only idempotent/reversible calls may be automatically retried; otherwise require human approval.
8. Resume once and collect evidence. If the same structural failure recurs, perform one final diagnostic cycle.
9. Hand recovery evidence to an independent Recovery Verifier.

## Decision points
- Orphan terminal event: block and investigate ordering/source.
- Duplicate call ID: block; IDs must be unique.
- Unresolved side-effecting call with unknown execution state: do not rerun automatically.
- Repaired transcript still invalid: stop.
- Same structural failure after 2 recovery cycles: escalate.

## Expected output
Integrity report, unresolved-call table, repaired-copy path if applicable, side-effect decision, resume evidence, verification status.

## Metrics
Invalid event count; unresolved calls; duplicate IDs; automatic reruns avoided; successful recoveries; repeated structural failures.

## Verification
Validator exit 0 on candidate transcript plus successful bounded resume and independent review.

## Failure handling
Maximum 2 recovery cycles. Preserve all evidence and stop on uncertainty involving irreversible effects.

## Stop conditions
Stop on invalid repair, unknown high-risk side effect, or recurrence after second cycle.