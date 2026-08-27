# Graceful Degradation Rules

## Purpose
Preserve the most valuable safe API behavior when dependencies or capacity are partially unavailable.

## Scope
Covers fallbacks, stale reads, feature shedding, partial responses, and reduced-quality modes.

## MUST
- Degraded modes MUST define which guarantees are preserved, weakened, or unavailable.
- Security, authorization, tenant isolation, and data-integrity invariants MUST remain enforced during degradation.
- Clients MUST receive contract-compatible signals when behavior or freshness is reduced.
- Degradation triggers and recovery conditions MUST be observable and tested.
- Fallback data MUST have explicit freshness and correctness bounds.

## MUST NOT
- MUST NOT silently convert failed writes into apparent success.
- MUST NOT bypass authorization because an identity or policy dependency is unavailable.
- MUST NOT serve stale data when doing so can create unsafe or materially incorrect actions unless explicitly approved.

## SHOULD
- Degradation SHOULD prioritize critical read paths and recovery operations.
- Modes SHOULD be reversible without redeployment where safe operational controls exist.

## Exceptions
Exceptions require user-impact analysis, preserved invariants, duration, approval, and recovery verification.

## Verification
Use fault injection, dependency outage tests, contract tests, security tests, telemetry inspection, and recovery drills.