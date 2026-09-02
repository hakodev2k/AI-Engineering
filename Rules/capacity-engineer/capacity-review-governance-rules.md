# Capacity Review Governance

## Purpose
Establish recurring review and ownership so capacity risk is managed before it becomes urgent.

## Scope
Applies to critical services, shared platforms, infrastructure pools, and dependencies with material scaling lead time.

## MUST
- Critical systems MUST have an accountable owner for capacity forecasting and remediation.
- Capacity reviews MUST examine demand trend, forecast error, headroom, saturation risk, open constraints, and planned events.
- Risks that can breach service objectives within the planning horizon MUST have dated actions and owners.
- Assumptions and accepted risks MUST be revisited when their review date or trigger is reached.

## MUST NOT
- MUST NOT treat a capacity dashboard as a substitute for accountable review and decisions.
- MUST NOT leave material capacity risks without ownership or due dates.
- MUST NOT silently carry forward stale forecasts after major architecture or demand changes.

## SHOULD
- Review frequency SHOULD increase as headroom shrinks or expansion lead time grows.
- Shared capacity pools SHOULD include allocation and contention review across tenants.

## Exceptions
Reduced review cadence requires documented stability evidence, risk assessment, and approval.

## Verification
Inspect review records, risk registers, owners, forecast updates, action completion, and evidence that stale assumptions are retired.
