# Idempotency Assessment Skill

## Purpose
Prove whether a retried or duplicated background-job delivery can produce more than one business effect.

## When to use
Use for queue consumers, schedulers, webhooks converted to jobs, Hangfire/Quartz workers, outbox consumers, or any at-least-once delivery path.

## Inputs
Job entry point, payload identity, retry/ack behavior, persistence boundaries, external side effects, relevant tests/logs, and `config/idempotency-policy.json`.

## Preconditions
Repository is readable; the target job is identifiable. Production mutation is not required.

## Allowed tools
Repository search/read, local static scanner, test/build commands, read-only logs/metrics, disposable test infrastructure.

## Constraints
Treat scanner output as hypotheses. Never infer exactly-once delivery from a queue product name. Never expose secrets from payloads or connection strings.

## Procedure
1. Identify the delivery entry point and the exact condition that acknowledges/completes the message.
2. Trace the stable business operation identity from producer through consumer. Reject random per-attempt keys as idempotency evidence.
3. Enumerate every durable and external side effect in execution order.
4. Locate transaction/commit boundaries and determine whether duplicate detection and the protected durable effect are atomic.
5. Determine behavior for a crash before effect, after effect/before acknowledgement, and during external calls.
6. Classify retries: transient, validation, business-rule, permission, and unknown. Confirm retry count is bounded.
7. Run `python3 scripts/scan-idempotency.py <repo> --output scan.json`; validate each hit against code context.
8. Design a duplicate-delivery test using the same logical operation key at least twice. Measure durable/external effect count, not only successful handler returns.
9. Design a retry-after-partial-failure test. For external effects, require a provider idempotency key, durable receipt/outbox/inbox record, or reconciliation strategy.
10. Recommend the smallest safe fix. Prefer uniqueness constraints, atomic inbox/outbox records, deterministic operation keys, and bounded retries.
11. Re-run focused tests, build/static checks, and inspect the diff.
12. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
A structured assessment containing evidence, risks, recommendations, verification flags, and remaining risks.

## Verification
A `pass` requires duplicate delivery tested, retry behavior tested, and observed business effect count verified as one for the same logical operation.

## Failure handling
Retry transient tool/test infrastructure failures at most twice. Do not retry deterministic test failures without a code/config change. Preserve logs and failing inputs. Escalate permission/environment blockers.

## Stop conditions
Stop before approval-required actions, after two repeated infrastructure failures, when stable operation identity cannot be established, or when production-only evidence would require mutation.
