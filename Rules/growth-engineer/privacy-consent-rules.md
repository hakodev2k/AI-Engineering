# Privacy and Consent Rules

## Purpose
Ensure growth systems respect privacy, consent, data minimization, and user expectations.

## Scope
Tracking, personalization, targeting, lifecycle messaging, identity, and experimentation data.

## MUST
- Collect and process only data justified by a defined purpose and applicable consent or legal basis.
- Respect consent state consistently across collection, activation, targeting, and downstream exports.
- Require review before introducing sensitive-data collection or materially new data uses.

## MUST NOT
- Circumvent consent controls to preserve analytics coverage.
- Store secrets or unnecessary sensitive attributes in growth telemetry.

## SHOULD
- Design metrics and experiments to work with minimized or aggregated data where feasible.

## Exceptions
Any legally permitted exception requires documented basis, scope, retention, access controls, and approval.

## Verification
Inspect schemas, consent propagation, tag/event behavior, retention settings, access policies, deletion flows, and approval evidence.