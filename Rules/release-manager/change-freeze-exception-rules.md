# Change Freeze Exception Rules

## Purpose
Protect high-sensitivity periods while allowing genuinely necessary changes through a controlled, auditable exception process.

## Scope
Applies to business, seasonal, regulatory, operational, incident-related, or organization-defined production change freezes.

## MUST
- Freeze scope, effective period, affected systems, prohibited change classes, and exception authority MUST be explicit.
- A freeze exception MUST state why delaying the change creates greater risk or impact than executing it during the freeze.
- Exception review MUST evaluate customer/business impact, blast radius, reversibility, validation evidence, staffing, dependency readiness, and recovery capability.
- Approved exceptions MUST define exact scope and MUST NOT imply permission for unrelated changes.
- Post-change validation and heightened observation MUST be defined for material freeze exceptions.

## MUST NOT
- Deadline pressure, convenience, or already-completed implementation MUST NOT by itself justify a freeze exception.
- A Release Manager or AI agent MUST NOT self-approve an exception when policy requires independent human authorization.
- A previously granted exception MUST NOT be reused for materially changed scope, candidate, target, or risk.

## SHOULD
- Freeze exceptions SHOULD minimize scope and prefer reversible, progressively delivered changes where technically appropriate.
- Repeated exception patterns SHOULD trigger review of planning, freeze design, or operational process rather than normalization of bypasses.

## Exceptions
Incident containment may use pre-defined emergency authority when delay would materially worsen impact; scope, actions, risk, approval, and retrospective evidence must still be recorded.

## Verification
Inspect freeze policy, exception request, business/risk rationale, candidate identity, test evidence, approver, deployment scope, production telemetry, and post-change validation.