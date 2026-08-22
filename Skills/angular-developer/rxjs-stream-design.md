# RxJS Stream Design

## Purpose
Design asynchronous Angular workflows with RxJS while controlling cancellation, concurrency, errors, and subscription lifetime.

## When to use
Use for HTTP composition, user-event streams, real-time events, polling, or async workflows requiring temporal operators.

## Inputs
Event sources, API behavior, cancellation requirements, error policy, and existing streams.

## Context to inspect
Inspect subscriptions, flattening operators, multicasting, retry logic, teardown, schedulers, and signal interop.

## Core knowledge
Operator choice encodes concurrency semantics: switchMap cancels previous work, concatMap serializes, exhaustMap ignores overlapping triggers, and mergeMap allows concurrency. Errors and sharing boundaries must be intentional.

## Procedure
1. Define source events and desired output semantics.
2. Specify cancellation and concurrency behavior.
3. Choose flattening operators accordingly.
4. Place error handling at the correct scope.
5. Add timeouts/retries only for appropriate failures.
6. Share streams only when duplicated work is undesirable.
7. Ensure teardown via framework lifecycle utilities.
8. Test rapid events, failures, and completion behavior.

## Decision points
Prefer signals for simple synchronous state; retain RxJS where temporal composition is the problem. Retry only transient, safe operations.

## Common failure patterns
Nested subscriptions, unbounded mergeMap, stale switchMap assumptions, retry storms, leaked subscriptions, shareReplay misuse, and swallowed errors.

## Verification
Test overlapping events, cancellation, error recovery, teardown, duplicate network calls, and expected ordering.

## Expected output
Readable streams whose concurrency and failure semantics are explicit.

## Stop conditions
Stop when external API idempotency or required ordering cannot be determined.