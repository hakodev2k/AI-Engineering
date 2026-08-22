# Poison Message and DLQ Workflow

## Trigger
Repeated consumer failure, message moved to DLQ, delivery-attempt threshold warning, or operator-requested replay review.

## Entry conditions
A message identifier or sanitized envelope exists and read access to relevant logs/repository context is available.

## Inputs
Message envelope, failure logs, consumer code, schema, queue policy, and current deployment/build identifier when known.

## Flow
```text
Trigger -> Capture evidence -> Classify -> Reproduce -> Fix -> Test -> Independent verify -> Approval gate -> Minimal replay -> Observe -> Complete
```

## Stages
1. **Capture** — Queue Investigator records immutable metadata and redacts payload evidence.
2. **Deterministic classification** — run `scripts/analyze_message.py`. Checkpoint: no production mutation.
3. **Repository trace** — Queue Investigator traces deserialize -> validate -> dependency/persistence -> acknowledge path.
4. **Reproduction** — build a sanitized local/test reproduction. If impossible, status becomes `needs-review`.
5. **Fix** — implementation owner makes the smallest safe change. Breaking contracts, schema changes, production config changes, or destructive data remediation require human approval before execution.
6. **Test** — run targeted regression plus relevant suite. Maximum automated fix/test cycles: 2. Preserve test output on every failed cycle.
7. **Independent verification** — Verification Agent checks root cause, bounded retry, acknowledgement, schema compatibility, and duplicate-delivery safety.
8. **Replay decision** — if no replay is needed, complete after verification. If replay is needed, fill `templates/replay-approval.md` and stop until explicit approval exists.
9. **Replay** — first production replay batch is one message unless approval explicitly permits another size, never above policy `max_replay_batch`.
10. **Observe** — verify successful consumption and downstream state before further replay.

## Retry rules
- Transient test/tool failure: retry at most 2 times.
- Transient message processing: use configured bounded broker retry, never beyond `max_delivery_attempts`.
- Deterministic schema/business failure: no blind retry; quarantine and fix root cause.
- Repeated replay failure: stop after first deterministic repeat and preserve all evidence.

## Failure paths
Permission failure -> `blocked`, no permission escalation. Missing evidence -> `needs-review`. Build/test failure after 2 cycles -> stop and hand back to implementation. Duplicate side effect -> stop replay immediately and mark high risk.

## Produced artifacts
Structured analysis JSON, regression test/evidence, verification result, and replay approval record when applicable.

## Definition of Done
Failure is classified with evidence; root cause is fixed or explicitly unresolved; targeted tests pass; independent verification passes; any replay has explicit approval and observed success; no blocking failure remains.
