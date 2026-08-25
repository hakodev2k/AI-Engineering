# Policy Governance Rules

## Purpose
Turn secrets-management expectations into enforceable, reviewable, risk-based controls.

## Scope
Standards for ownership, storage, access, lifetime, rotation, monitoring, exceptions, and platform use.

## MUST
- Policies MUST define measurable requirements and accountable owners for credential classes and environments.
- Policy changes with material operational impact MUST include compatibility, rollout, rollback, and communication plans.
- Exceptions MUST be recorded with scope, reason, risk, compensating controls, approver, and expiry.
- Controls MUST distinguish mandatory safety requirements from preferences.

## MUST NOT
- Policy MUST NOT require technically impossible controls without an approved exception mechanism.
- Exceptions MUST NOT become permanent through automatic renewal without reassessment.
- Compliance MUST NOT be claimed from documentation alone when technical evidence is available.

## SHOULD
- Encode stable requirements as policy-as-code where deterministic enforcement is practical.
- Review policy using incident findings, platform capability, and measured exception patterns.

## Exceptions
The exception process itself may only be bypassed during an authorized emergency and must be reconciled afterward.

## Verification
Inspect policy text, automated checks, exception register, expiry enforcement, change records, rollout evidence, and sampled provider configuration.