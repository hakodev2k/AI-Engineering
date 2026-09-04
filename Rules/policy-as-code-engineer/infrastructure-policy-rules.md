# Infrastructure Policy Rules

## Purpose
Govern infrastructure changes with deterministic policy checks that prevent unsafe, noncompliant, or unexpectedly expensive configurations.

## Scope
Applies to infrastructure-as-code plans, cloud resources, networking, identity, storage, compute, encryption, resilience, and destructive changes.

## MUST
- Infrastructure policy MUST evaluate proposed state before apply whenever the platform supports planning.
- Destructive, internet-exposing, privilege-expanding, or encryption-weakening changes MUST be classified high risk.
- Policy checks MUST use explicit environment and resource context.
- High-risk policy violations MUST block automation unless an approved bounded exception exists.
- Policy changes affecting production controls MUST be tested against representative infrastructure plans.

## MUST NOT
- Production protection rules MUST NOT be disabled merely to unblock a deployment.
- Unknown resource types MUST NOT silently pass controls intended to cover all resources.
- Policy MUST NOT assume provider defaults are secure without validation.

## SHOULD
- Policies SHOULD distinguish preventive controls from advisory optimization guidance.
- Cost and resilience constraints SHOULD be evidence-based and environment-aware.

## Exceptions
Require documented justification, affected resources, duration, risk, compensating controls, rollback, and accountable approval.

## Verification
Evaluate known-good and known-bad plans, destructive-change cases, environment boundaries, exception expiry, and CI enforcement. Inspect resulting infrastructure configuration where runtime drift is possible.