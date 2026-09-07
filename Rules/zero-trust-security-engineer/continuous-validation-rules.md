# Continuous Validation Rules

## Purpose
Ensure trust decisions remain valid over time as identity, device, workload, and threat context changes.

## Scope
Applies to active sessions, long-lived processes, privileged access, service credentials, and dynamic risk signals.

## MUST
- Long-lived access MUST define which context changes trigger re-evaluation.
- Policy engines MUST have freshness requirements for external risk and posture signals.
- Revocation, disablement, or compromise events MUST invalidate affected access within an explicit maximum delay.
- Continuous validation MUST have safe behavior when required context sources are unavailable.

## MUST NOT
- MUST NOT assume initial authentication remains sufficient indefinitely.
- MUST NOT accept stale high-risk context silently when freshness is required.
- MUST NOT create re-authentication loops that operators bypass with weaker controls.

## SHOULD
- Re-evaluation SHOULD be risk-proportionate to reduce unnecessary friction.
- Validation design SHOULD account for clock skew, propagation delays, and partial outages.

## Exceptions
Relaxed revalidation requires documented availability trade-off, bounded exposure, monitoring, approval, and review date.

## Verification
Test revocation latency, posture changes, threat-signal changes, stale-data handling, partial outages, and long-running sessions against documented policy expectations.