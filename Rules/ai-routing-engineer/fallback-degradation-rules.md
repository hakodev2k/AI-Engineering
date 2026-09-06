# Fallback and Degradation Rules

## Purpose
Provide predictable behavior when preferred models or providers are unavailable or unsuitable.

## Scope
Fallback chains, degraded modes, substitutions, feature reduction, and no-target behavior.

## MUST
- Every critical route MUST define bounded fallback behavior or an explicit fail-closed outcome.
- Each fallback target MUST satisfy all hard safety, privacy, residency, and capability requirements.
- Degraded behavior MUST identify which quality, latency, or feature guarantees change.
- Fallback activation MUST be observable and attributable to a reason.
- Recovery to the preferred route MUST avoid oscillation and MUST use defined health criteria.

## MUST NOT
- MUST NOT silently fall back to a model that lacks mandatory capabilities.
- MUST NOT bypass policy controls during incidents.
- MUST NOT create unbounded fallback chains.

## SHOULD
- Prefer simple fallback trees with independently testable conditions.
- Inform downstream systems when degraded behavior materially changes output guarantees.

## Exceptions
Exceptions require bounded blast radius, documented risk, expiry, and approval.

## Verification
Run provider-failure tests, policy-gate tests, degraded-mode integration tests, and inspect fallback metrics.