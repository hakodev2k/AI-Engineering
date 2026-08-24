# Producer Reliability

## Purpose
Ensure producers publish safely under latency, retries, and broker failures.

## Scope
Acknowledgements, batching, retries, timeouts, serialization, and producer lifecycle.

## MUST
- Producers MUST define timeout, acknowledgement, retry, and failure-reporting behavior.
- Publication failures MUST be surfaced or durably captured when message loss is unacceptable.
- Producer configuration MUST match the required durability and ordering semantics.

## MUST NOT
- MUST NOT ignore asynchronous publish errors.
- MUST NOT retry non-idempotent publication blindly when duplicates cause harmful effects.

## SHOULD
- Reuse producer connections and batch only within acceptable latency and memory bounds.

## Exceptions
Document loss/duplicate risk, evidence, safeguards, and approval.

## Verification
Test broker outages, timeouts, retry paths, serialization errors, and producer metrics.