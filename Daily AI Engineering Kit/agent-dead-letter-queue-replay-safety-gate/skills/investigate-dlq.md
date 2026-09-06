# Skill: Investigate a Dead-Letter Queue

## Purpose
Determine why messages were dead-lettered and whether replay is technically and semantically safe.

## When to use
After a production incident, consumer fix, dependency recovery, schema rollout, or queue backlog alert when a DLQ contains messages that may need reprocessing.

## Inputs
Queue/DLQ identity, exported message sample or JSONL snapshot, consumer source revision, recent deployment/incidence context, observability evidence, replay policy.

## Preconditions
The investigator has read access to repository and exported evidence. Production queue mutation is not required.

## Required context
1. Consumer entry point and message contract.
2. Retry/dead-letter configuration.
3. Idempotency/deduplication behavior.
4. Relevant database or external side-effect boundaries.
5. Logs/traces for representative failures.

## Allowed tools
Repository read/search, log/query read tools, message export readers, `scripts/dlq_replay_gate.py plan`, tests.

## Constraints
Do not mutate the queue, delete messages, change retry policy, or expose secrets.

## Procedure
1. Identify the consumer entry point and deserialize/validate path.
2. Trace the message from receipt through validation, state changes, external calls, acknowledgment, and exception handling.
3. Locate retry and dead-letter thresholds; determine which failures are retried automatically.
4. Establish the idempotency key and where duplicate suppression is enforced.
5. Sample failures by class, not only by most recent timestamp.
6. Separate confirmed facts from hypotheses. Link each failure class to log/trace/repository evidence.
7. Determine whether the original cause is still present.
8. Export candidate messages without modifying queue state.
9. Run the deterministic planner and inspect all `blocked`/`needs-review` reasons.
10. Produce a replay recommendation per failure class: replayable, requires code/data repair first, or permanently quarantined.

## Expected output
An evidence-backed investigation note and machine-readable replay plan.

## Verification
Every replay recommendation must point to the consumer behavior, failure evidence, and idempotency boundary that justifies it.

## Failure handling
If message bodies cannot be safely exported, use metadata and controlled representative samples. If idempotency cannot be proven, classify affected messages `needs-review` or `blocked`.

## Stop conditions
Stop before production replay, data mutation, policy changes, or any operation that requires increased privileges.
