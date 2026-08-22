# RxJS Concurrency Rules

## Purpose
Prevent race conditions, leaks, stale responses, and uncontrolled asynchronous work in Angular applications.

## Scope
Observables, higher-order mapping, subscriptions, cancellation, multicasting, retries, and stream composition.

## MUST
- Choose `switchMap`, `concatMap`, `exhaustMap`, or `mergeMap` according to required cancellation, ordering, exclusion, and concurrency semantics.
- Bound subscriptions by framework lifecycle or an explicit longer-lived owner.
- Handle expected error paths at the layer that can make a meaningful recovery or presentation decision.
- Make retry policies bounded and safe for the operation being retried.

## MUST NOT
- Use nested subscriptions when stream composition can express the dependency.
- Retry non-idempotent mutations blindly.
- Leave long-lived subscriptions without ownership and teardown.
- Use multicasting/cache operators without understanding reset and replay behavior.

## SHOULD
- Keep streams declarative and name important concurrency assumptions in code or tests.

## Exceptions
An imperative subscription is acceptable for a terminal side effect when ownership and cleanup are explicit.

## Verification
Review operator semantics, lifecycle teardown, network races, error tests, and cancellation behavior.