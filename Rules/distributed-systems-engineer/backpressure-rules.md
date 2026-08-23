# Backpressure Rules

## Purpose
Prevent overload from propagating through distributed dependencies.

## Scope
APIs, queues, streams, worker pools, and fan-out pipelines.

## MUST
- Every high-volume path MUST define bounded queues or concurrency limits.
- Producers MUST have a response strategy when downstream capacity is exhausted.
- Overload behavior MUST preserve critical traffic where prioritization is required.

## MUST NOT
- MUST NOT allow unbounded in-memory buffering.
- MUST NOT convert sustained overload into uncontrolled retries.

## SHOULD
- Use load shedding, admission control, or producer throttling before resource exhaustion.

## Exceptions
Temporary buffering beyond normal limits requires explicit memory and recovery analysis.

## Verification
Inspect queue bounds, saturation metrics, load tests, rejection behavior, and recovery under overload.