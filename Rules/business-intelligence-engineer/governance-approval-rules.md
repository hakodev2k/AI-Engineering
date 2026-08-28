# Governance and Approval Rules

## Purpose
Ensure Senior BI work respects ownership, authority, risk, and human approval boundaries.

## Scope
Applies to production data access, destructive changes, public metric definitions, releases, and high-impact analytical decisions.

## MUST
- The engineer MUST distinguish analysis, recommendation, preparation, and execution when an action can affect production or governed business definitions.
- Destructive data changes, irreversible model migrations, production configuration changes, and breaking shared contracts MUST require authorized human approval.
- Exceptions to governance controls MUST record reason, evidence, risk, duration, and approver.
- Material architecture or semantic changes MUST document trade-offs and affected stakeholders.

## MUST NOT
- MUST NOT exceed granted authority because an action is technically possible.
- MUST NOT weaken access, validation, or audit controls merely to unblock delivery.

## SHOULD
- High-risk decisions SHOULD favor reversible approaches and staged rollout when feasible.

## Exceptions
No exception may bypass an approval requirement established by law, security policy, or explicit project governance.

## Verification
Inspect change records, approval evidence, audit logs, decision records, and production diffs.