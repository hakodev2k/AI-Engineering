# Investigate Poison Message

## Purpose
Determine why a message repeatedly fails without turning a transient failure into a permanent quarantine decision.

## Inputs
Queue/subscription name, handler entry point, sanitized message metadata, delivery count, exception evidence, relevant logs and tests.

## Preconditions
Use non-production or read-only access. Payload bodies containing secrets or personal data must not be copied into reports.

## Procedure
1. Identify the consumer entry point and acknowledgement semantics.
2. Trace deserialize → validate → business operation → external dependencies → acknowledgement.
3. Record message identifier, type, delivery count, payload hash, handler version and error fingerprint.
4. Classify the failure as transient infrastructure, malformed/unsupported payload, deterministic business-rule failure, code defect, permission/configuration failure, or unknown.
5. Check whether the handler is idempotent before recommending replay.
6. Inspect retry configuration and determine whether the same deterministic failure is being retried without new evidence.
7. Locate dead-letter/quarantine behavior and retention policy.
8. Reproduce with a sanitized fixture when possible.
9. Produce facts, hypotheses, evidence, confidence and unresolved questions separately.

## Verification
A conclusion is verified only when reproduction, tests, or stable logs support the same failure fingerprint.

## Failure handling
If evidence is insufficient, return `blocked`; do not infer malformed payload or safe replay.

## Stop conditions
Stop before production replay, deletion, retention changes, permission changes, or payload disclosure.