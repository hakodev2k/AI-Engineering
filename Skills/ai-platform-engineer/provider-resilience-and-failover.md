# Provider Resilience and Failover

## Purpose
Design resilient provider integrations that degrade predictably during rate limits, outages, regional failures, and provider-specific incidents.

## When to use
Use when critical workloads depend on external model providers or when provider incidents have caused user-visible failures.

## Inputs
- Provider availability characteristics
- Model compatibility requirements
- SLOs
- Retry and timeout behavior
- Approved fallback models/providers

## Context to inspect
Inspect provider status history, client retries, timeout settings, model feature dependencies, regional endpoints, quota limits, circuit breakers, queue behavior, and incident reports.

## Core knowledge
Failover is not equivalent to reliability if the fallback changes semantics or safety behavior. Retries can amplify provider incidents. Resilience should distinguish transient transport failures, rate limits, capacity exhaustion, policy errors, and incompatible requests.

## Procedure
1. Classify provider failure modes and observable signals.
2. Define per-operation timeout budgets.
3. Define bounded retry rules with backoff and jitter.
4. Add circuit breaking for persistent failures.
5. Identify workloads eligible for alternate models or providers.
6. Evaluate fallback quality and feature compatibility.
7. Define degraded responses when no safe substitute exists.
8. Isolate provider quotas by criticality where possible.
9. Add health and saturation telemetry.
10. Test failover under realistic partial failures.
11. Confirm fallback does not violate residency or policy requirements.
12. Document manual override and recovery procedures.

## Decision points
Fail over only when compatibility and policy permit. Prefer explicit degraded behavior over silently substituting a materially different model. Queue asynchronous work when latency is flexible; fail fast for interactive workloads whose deadline has expired.

## Common failure patterns
Retry storms, automatic fallback to unapproved models, ignoring rate-limit headers, timeouts larger than end-to-end SLOs, cascading failures through shared gateways, and assuming provider status pages detect all incidents.

## Verification
Verify bounded retries, circuit behavior, timeout budgets, failover quality, policy compliance, and recovery with chaos or fault-injection tests.

## Expected output
A provider resilience policy with failure taxonomy, retry limits, fallback eligibility, degraded modes, tests, and recovery runbooks.

## Stop conditions
Stop when fallback models have not been evaluated, regulatory constraints prohibit alternate routing, or resilience changes could silently alter high-risk decisions.