# Exception and Risk Acceptance Rules

## Purpose
Ensure deviations from security controls are explicit, bounded, time-limited, and owned by accountable decision-makers.

## Scope
Applies to control exceptions, policy deviations, remediation deferrals, compensating controls, and formal risk acceptance.

## MUST
- Every exception MUST identify the violated requirement, affected scope, reason, risk, compensating controls, owner, approver, and expiry or review date.
- Risk acceptance MUST be approved by an authority with accountability for the affected business risk.
- Expired exceptions MUST be remediated, renewed with fresh review, or escalated.
- Material exceptions MUST be visible in compliance reporting.

## MUST NOT
- Exceptions MUST NOT be open-ended by default.
- Engineers or automated agents MUST NOT self-approve exceptions that weaken controls they implement or operate.
- Repeated renewals MUST NOT substitute indefinitely for a remediation decision without escalation.

## SHOULD
- Centralize exception records and monitor aging, concentration, and recurring root causes.
- Require stronger evidence and shorter validity for high-risk exceptions.

## Exceptions
This rule itself may be deviated from only under documented emergency governance approved by the designated risk authority.

## Verification
Inspect the exception register, approvals, expiry handling, compensating-control evidence, renewals, and linkage to findings and assets.