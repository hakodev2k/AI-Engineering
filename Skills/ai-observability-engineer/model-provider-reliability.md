# Model Provider Reliability

## Purpose
Observe and diagnose reliability differences across external or internal model providers and deployment endpoints.

## When to use
Use when operating multiple providers/models, handling rate limits, designing fallback, or investigating upstream instability.

## Inputs
Provider responses, status/error taxonomy, quotas, traces, latency, retries, model versions, and routing rules.

## Context to inspect
Inspect SDK behavior, timeout configuration, rate-limit headers, regional endpoints, fallback logic, retry policy, circuit breakers, and provider status evidence.

## Core knowledge
Provider failures include transport errors, throttling, overload, safety refusal, invalid requests, model unavailability, malformed responses, and semantic degradation. They require different actions. Retries can amplify outages.

## Procedure
1. Normalize provider outcomes into an internal error taxonomy while retaining raw codes in logs.
2. Instrument success, throttling, timeout, server error, invalid request, and fallback rates.
3. Track latency and TTFT by provider/model/region.
4. Record retry count and final outcome.
5. Correlate incidents with quota utilization and provider changes.
6. Define fallback eligibility by error class and workload requirements.
7. Alert on sustained deviations from baseline using minimum traffic thresholds.
8. During incidents, compare providers using the same workload cohort.
9. Review whether routing or retry policy worsened impact.

## Decision points
Fallback only when semantic compatibility and data policy allow it. Retry transient failures with bounded backoff; do not retry deterministic invalid requests.

## Common failure patterns
Treating every non-200 as equivalent, retry storms, hidden SDK retries, provider-specific labels with uncontrolled cardinality, and assuming a fallback is quality-equivalent.

## Verification
Inject or simulate representative provider failures and prove telemetry, retry, fallback, and alert behavior match policy.

## Expected output
Normalized provider health metrics, diagnostics, fallback evidence, and incident-ready dashboards.

## Stop conditions
Stop if fallback violates residency/security requirements or provider error semantics cannot be safely mapped.