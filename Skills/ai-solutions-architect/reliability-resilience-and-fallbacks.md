# Reliability, Resilience, and Fallbacks

## Purpose
Design AI solutions that continue to deliver acceptable service when models, providers, retrieval systems, tools, or dependencies fail or degrade.

## When to use
Use for production architectures with availability, continuity, or recovery requirements.

## Inputs
SLOs, dependency map, failure history, provider limits, recovery objectives, acceptable degraded modes, and business criticality.

## Context to inspect
Inspect dependency availability, timeout behavior, quotas, regional architecture, queues, caches, retry policies, provider failover options, and incident runbooks.

## Core knowledge
Probabilistic AI quality adds a degradation mode beyond simple uptime. Reliability architecture must address hard failures, slow responses, rate limits, malformed output, quality regressions, stale retrieval, and partial workflow completion.

## Procedure
1. Enumerate failure modes for each dependency and AI stage.
2. Define acceptable degraded behavior per user journey.
3. Set timeout budgets and bounded retry policies.
4. Add circuit breaking or load shedding where cascading failure is possible.
5. Define provider, model, retrieval, or deterministic fallback options.
6. Make long-running work resumable with checkpoints where appropriate.
7. Design idempotency for retried side effects.
8. Define data consistency expectations during partial failure.
9. Test dependency loss, throttling, latency spikes, and quality degradation.
10. Document recovery and operator actions.

## Decision points
Use multi-provider fallback only when portability and operational cost are justified. Prefer graceful feature reduction over silent low-quality behavior. Queue work when delay is acceptable; fail fast when stale results are harmful.

## Common failure patterns
Unlimited retries, no latency budget, fallback models that violate quality requirements, duplicate side effects, and treating provider uptime as end-to-end reliability.

## Verification
Failure tests demonstrate bounded recovery, no uncontrolled duplication, clear degraded behavior, and conformance with SLOs and recovery objectives.

## Expected output
A resilience design with failure modes, timeouts, retries, fallbacks, recovery paths, and test evidence.

## Stop conditions
Stop when critical workflows have no acceptable degraded mode, fallback behavior is unvalidated, or recovery requirements exceed feasible architecture.