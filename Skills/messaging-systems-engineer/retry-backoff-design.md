# Retry and Backoff Design

## Purpose
Recover transient messaging failures without amplifying outages or causing uncontrolled duplicate work.

## When to use
Use for producer sends, consumer processing and dependent service calls.

## Inputs
Failure taxonomy, latency budget, attempt cost, dependency limits and idempotency guarantees.

## Context to inspect
Current retries across layers, broker redelivery, timeouts, DLQ policy and rate limits.

## Core knowledge
Retries are load. Exponential backoff, jitter, bounded attempts and classification prevent synchronized retry storms.

## Procedure
1. Classify transient versus permanent failures.
2. Set timeout before retry policy.
3. Define bounded attempts and elapsed-time budget.
4. Apply exponential backoff with jitter.
5. Avoid nested multiplicative retries.
6. Route exhausted work deliberately.
7. Instrument attempts and recovery rate.
8. Load-test dependency failure.

## Decision points
Use delayed broker redelivery for long waits; local retry may suit short transient failures.

## Common failure patterns
Infinite retries, retrying validation errors, identical delays, no idempotency and retries at every layer.

## Verification
Simulate dependency degradation and verify bounded load, eventual recovery and correct terminal routing.

## Expected output
A documented retry policy with measurable limits.

## Stop conditions
Stop when failure classification or downstream retry safety is unknown.