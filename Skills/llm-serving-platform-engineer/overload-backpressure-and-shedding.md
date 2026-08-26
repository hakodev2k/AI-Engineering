# Overload, Backpressure, and Load Shedding

## Purpose
Keep the serving platform stable under demand beyond safe capacity by bounding work and failing predictably.

## When to use
Use for overload design, retry storms, queue growth, OOM cascades, or latency collapse.

## Inputs
Capacity curves, SLOs, traffic classes, queue limits, retry policy, autoscaling lag, tenant quotas.

## Context to inspect
Ingress rate limits, queues, scheduler, KV cache, worker concurrency, gateway retries, client retry guidance, and circuit breakers.

## Core knowledge
Unbounded queueing converts overload into universal latency failure. Backpressure must propagate toward callers; shedding should occur before expensive model work. Retries amplify overload unless bounded and jittered.

## Procedure
1. Determine safe service rate and saturation indicators. 2. Set queue/token/memory admission bounds. 3. Define rejection points before model execution. 4. Prioritize traffic according to policy. 5. Bound retries and use exponential backoff with jitter. 6. Prevent retry multiplication across layers. 7. Shed low-priority or oversized work first when justified. 8. Test sudden spikes, dependency slowdown, and capacity loss. 9. Verify recovery after demand falls. 10. Publish client-visible overload semantics.

## Decision points
Reject immediately when predicted wait exceeds deadline; queue only when work can still meet SLO. Use circuit breaking for failing dependencies, not as a substitute for serving-capacity controls.

## Common failure patterns
Unlimited queues, retries at every layer, HTTP success with hidden failures, no priority policy, and waiting until GPU OOM before shedding.

## Verification
Load beyond saturation and prove bounded queues, stable healthy-request latency, controlled rejection, and rapid recovery.

## Expected output
Explicit overload limits, backpressure behavior, shedding policy, and tested recovery characteristics.

## Stop conditions
Stop if service capacity is unmeasured, rejection semantics conflict with product requirements, or clients cannot safely handle overload responses.