# Reliability and Degraded Mode Rules

## Purpose
Ensure recommendation services fail predictably while preserving safety, policy, and minimum product utility.

## Scope
Applies to dependency outages, stale indexes, missing features, model failures, partial data loss, traffic spikes, and fallback ranking paths.

## MUST
- Every critical online dependency MUST have documented failure behavior and an explicit degraded-mode strategy.
- Degraded modes MUST preserve mandatory eligibility, privacy, and safety constraints.
- Fallback content sources and ranking logic MUST be versioned, tested, and observable before they are relied on in production.
- Staleness thresholds for indexes, features, and cached recommendations MUST be defined and monitored.
- Recovery from degraded mode MUST verify data and model consistency before restoring full personalization.

## MUST NOT
- MUST NOT fail open on safety or policy checks because a dependency is unavailable.
- MUST NOT silently serve arbitrarily stale personalized data beyond documented limits.
- MUST NOT introduce unlimited fan-out or retry storms during partial outages.

## SHOULD
- Degraded modes SHOULD preserve a useful baseline experience even when personalization quality is reduced.
- Failure isolation SHOULD prevent one candidate source, feature service, or model from taking down the full recommendation path.

## Exceptions
Exceptions require documented failure assumptions, bounded user impact, compensating controls, owner, and approval for material production risk.

## Verification
Review failure-mode tests, timeout and circuit-breaker configuration, staleness alerts, fallback traffic dashboards, chaos or fault-injection evidence, and recovery runbooks.