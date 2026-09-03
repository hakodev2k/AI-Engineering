# Load Shedding and Admission Control

## Purpose
Protect inference systems from collapse under overload by bounding queues, prioritizing work, and rejecting or degrading requests deliberately.

## When to use
Use when demand can exceed provisioned capacity or when long-running requests can monopolize accelerator memory and scheduler slots.

## Inputs
SLOs, traffic priorities, safe capacity, queue behavior, timeout policies, request sizes, and degradation options.

## Context to inspect
Inspect queue limits, active sequences, maximum token requests, tenant quotas, retries, client timeouts, streaming disconnects, and fallback models.

## Core knowledge
Unbounded queues convert overload into extreme tail latency and cascading retries. Admission control should operate before expensive resource allocation and align with business priority and fairness policies.

## Procedure
1. Define overload signals and safe operating region.
2. Set explicit queue and active-work limits.
3. Classify requests by priority and resource cost.
4. Reject impossible or excessively large requests early.
5. Define per-tenant or per-class quotas where needed.
6. Add token/context limits consistent with product requirements.
7. Select degradation paths such as smaller models or shorter outputs.
8. Return retry guidance only when retry is likely to succeed.
9. Test overload, retry storms, and client cancellation.
10. Monitor rejects, queue age, fairness, and recovery time.

## Decision points
Reject early when waiting would violate the caller's deadline. Degrade when a lower-cost path still meets minimum quality. Reserve capacity for critical traffic if shared fairness cannot guarantee it.

## Common failure patterns
Unbounded queues, indiscriminate 429 responses causing synchronized retries, ignoring request size, accepting work past client deadlines, and allowing one tenant to consume all KV cache.

## Verification
Verified means overload tests show bounded queue age, predictable rejection/degradation, preserved critical SLOs, and rapid recovery after demand falls.

## Expected output
Admission policy, overload thresholds, priority rules, degradation paths, and stress-test evidence.

## Stop conditions
Escalate when business priority rules are undefined, clients cannot tolerate any rejection, or fallback behavior creates unacceptable quality or safety risk.