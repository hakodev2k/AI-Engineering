# Backpressure and Flow Control

## Purpose
Prevent overload from cascading across messaging systems.

## Scope
Producer quotas, consumer concurrency, prefetch, batching, rate limits, and downstream saturation.

## MUST
- Every high-volume flow MUST define behavior when consumers fall behind.
- Consumer concurrency and prefetch MUST respect downstream capacity and memory bounds.
- Sustained lag MUST trigger actionable monitoring before retention or SLO limits are breached.

## MUST NOT
- MUST NOT solve lag by unbounded concurrency.
- MUST NOT allow producers to exhaust broker resources without quotas or equivalent controls where multi-tenancy exists.

## SHOULD
- Prefer explicit admission control and bounded buffering.

## Exceptions
Document load evidence, blast radius, safeguards, and approval.

## Verification
Run overload tests and inspect lag, queue depth, memory, throttling, and downstream saturation.