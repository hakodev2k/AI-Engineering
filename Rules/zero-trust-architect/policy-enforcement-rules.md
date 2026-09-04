# Policy Enforcement Rules

## Purpose
Ensure Zero Trust policy decisions are consistently enforced at trustworthy control points and fail predictably under degraded conditions.

## Scope
Applies to policy decision points, policy enforcement points, gateways, proxies, applications, service meshes, endpoints, and infrastructure controls.

## MUST
- Every protected access path MUST pass through an identified enforcement point that cannot be bypassed by an equivalent alternate path.
- Enforcement points MUST consume authenticated subject and resource context from trusted sources and MUST reject unverifiable high-risk requests.
- Policy versions deployed to enforcement points MUST be identifiable, integrity-protected, and traceable to an approved change.
- Decision and enforcement telemetry MUST include enough context to correlate policy version, subject, resource, action, outcome, and reason category without exposing unnecessary sensitive data.
- Failure behavior for unavailable policy services, stale policy, missing context, and telemetry loss MUST be explicitly defined by resource and action risk.
- Critical enforcement paths MUST be tested for bypass, stale policy, partial outage, and inconsistent policy propagation.

## MUST NOT
- Client-side controls MUST NOT be the sole enforcement mechanism for protected server-side resources.
- Enforcement points MUST NOT silently downgrade from deny-by-default to allow-by-default when required context cannot be validated for high-risk access.
- Direct backend endpoints MUST NOT remain reachable in ways that bypass a required gateway or policy enforcement layer.
- Policy decisions MUST NOT be cached beyond a documented freshness window when identity, entitlement, or risk changes could materially affect access.

## SHOULD
- Enforcement SHOULD occur as close as practical to the protected resource while preserving consistent policy semantics.
- Policy distribution SHOULD support staged rollout and rapid rollback.
- Multiple enforcement technologies SHOULD use normalized policy intent or tested equivalence when practical.

## Exceptions
Exceptions require documented reason, affected paths, risk, compensating controls, owner, expiry, rollback plan, and approval from the accountable security architect or resource owner.

## Verification
Review architecture flows, route exposure, policy versions, propagation mechanisms, configuration, traces, decision logs, bypass tests, and failure-injection tests. Verify every documented protected path reaches an active enforcement point.