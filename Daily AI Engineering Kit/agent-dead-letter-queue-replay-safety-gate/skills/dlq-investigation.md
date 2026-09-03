# Skill: DLQ Investigation

## Purpose
Determine why messages entered the DLQ and which messages, if any, are safe replay candidates.

## Inputs
Repository, exported DLQ evidence, queue identity, incident/task description, configuration.

## Preconditions
- Evidence export is read-only.
- Environment and queue identity are known.
- No replay permission is required for investigation.

## Allowed tools
Repository search/read, logs, traces, read-only queue metadata, local scripts, tests.

## Constraints
Do not mutate queue state, production configuration, messages, or data.

## Procedure
1. Inspect repository structure and locate producer, consumer, serializer, retry, and DLQ handling code.
2. Identify message schema/version and business key fields.
3. Run `scripts/analyze-dlq.py` on the exported evidence.
4. Group messages by failure class, handler, schema version, age, and tenant where available.
5. For each group, trace the failing execution path and collect code/log/test evidence.
6. Mark each group as transient, permanent, unknown, or already-resolved.
7. Identify side effects and existing idempotency/deduplication mechanisms.
8. Test one hypothesis at a time; do not convert scanner output directly into facts.
9. Produce candidate message IDs and exclusions with reasons.

## Expected output
A fact/hypothesis table containing finding, evidence, confidence, affected component, replay recommendation, and unresolved risk.

## Verification
Each replay candidate must have an evidenced failure classification and known handler path.

## Failure handling
If message identity, tenant scope, schema version, or failure class cannot be established, mark the message blocked and hand off without replay recommendation.

## Stop conditions
Stop before any message mutation or production replay.
