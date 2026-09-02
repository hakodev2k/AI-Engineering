# Async Messaging Tracing Rules

## Purpose
Preserve causality and diagnostic value across queues, streams, topics, retries, and fan-out processing.

## Scope
Applies to producers, consumers, brokers, batch delivery, retries, dead-letter flows, and message links.

## MUST
- Producer and consumer instrumentation MUST distinguish send, receive, and processing operations according to adopted conventions.
- Trace context MUST be propagated in approved message metadata without altering business payload semantics.
- Retries and redeliveries MUST remain distinguishable from first-attempt processing.
- Fan-out, batching, and fan-in MUST use parentage or span links that reflect real causality.

## MUST NOT
- MUST NOT assume a single parent is semantically correct for batches containing unrelated messages.
- MUST NOT overwrite broker or application correlation identifiers with tracing identifiers.
- MUST NOT create infinite causal chains for long-lived streams when lifecycle boundaries require re-rooting.

## SHOULD
- Record bounded messaging metadata useful for queue delay and processing diagnosis.
- Trace dead-letter and poison-message paths explicitly when operationally important.

## Exceptions
Exceptions require broker limitations, alternative correlation evidence, risk assessment, and review.

## Verification
Run producer-to-consumer integration tests, inspect retries, batches, fan-out/fan-in, dead-letter flows, and validate queue-delay and processing spans in the tracing backend.
