# Timeout and Retry Rules

## Purpose
Prevent retry storms, excessive tail latency, and resource exhaustion during dependency degradation.

## Scope
Proxy timeouts, connect timeouts, request deadlines, retry policies, retry budgets, and hedging.

## MUST
- Every network operation governed by the load-balancing tier MUST have bounded timeout behavior.
- Retries MUST be limited by attempt count or retry budget and MUST fit within the caller's end-to-end deadline.
- Retry eligibility MUST consider method safety, idempotency, request-body replayability, and failure class.
- Retry policies MUST be evaluated for multiplicative effects across multiple network layers.
- Changes MUST be load-tested or otherwise evidenced when they can materially alter request amplification.

## MUST NOT
- MUST NOT automatically retry non-idempotent operations unless duplicate effects are prevented by contract.
- MUST NOT retry indefinitely.
- MUST NOT configure independent retry layers that can create uncontrolled exponential request multiplication.

## SHOULD
- Use jittered backoff where retries span meaningful time.
- Prefer retry budgets tied to healthy request volume for large distributed systems.

## Exceptions
Exceptions require documented idempotency guarantees, amplification analysis, evidence, and owner approval.

## Verification
Inject connect failures, resets, timeouts, and 5xx responses; verify attempts, deadline adherence, request amplification, backend load, and user-visible latency.