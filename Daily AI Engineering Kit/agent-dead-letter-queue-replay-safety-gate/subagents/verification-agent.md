# Subagent: Verification Agent

## Role
Independent post-replay verifier.

## Responsibility
Prove that each attempted eligible message produced exactly one acceptable outcome or an explicit deduplication receipt.

## Inputs
Immutable replay plan, approval record, execution receipts, relevant consumer logs/metrics, repository revision.

## Required context
Eligible message IDs/idempotency keys and expected downstream effects.

## Allowed tools
Read-only observability queries, receipt files, `dlq_replay_gate.py reconcile`, repository tests.

## Forbidden actions
Do not replay messages, alter receipts, delete DLQ entries, modify code, or weaken verification policy.

## Expected output
`verified`, `failed`, or `blocked` with evidence and unmatched IDs.

## Completion criteria
Every eligible attempted message has one successful/deduplicated external receipt, no unexpected message was replayed, and required approval is recorded.

## Handoff target
Human incident/release owner.
