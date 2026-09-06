# Lifecycle and Retirement Rules

## Purpose
Manage model risk from initial approval through operation, renewal, deprecation, and retirement.

## Scope
Applies to model onboarding, periodic review, renewal, replacement, deprecation, and end-of-life activities.

## MUST
- Every production model MUST have a lifecycle state and review cadence proportional to risk.
- Periodic review MUST reconsider intended use, risk classification, monitoring evidence, incidents, provider changes, and material environmental changes.
- Retirement plans MUST address dependent systems, retained data, access revocation, archived evidence, and user or operator communication where relevant.
- Unsupported or unreviewed models MUST be removed from high-risk production use unless explicitly risk-accepted.
- Replacements MUST be validated against the material risks and contracts of the model they replace.

## MUST NOT
- Deprecated models MUST NOT remain silently reachable through undocumented fallback paths.
- Retirement MUST NOT destroy evidence required for audit, incident, legal, or reproducibility obligations.

## SHOULD
- Teams SHOULD automate reminders for review and retirement milestones.
- Model inventories SHOULD preserve historical status changes for auditability.

## Exceptions
Extended use beyond a review or retirement deadline requires documented rationale, evidence, compensating controls, duration, residual risk, and approval.

## Verification
Inspect lifecycle records, dependency maps, access controls, archival evidence, retirement tickets, and production configuration to confirm obsolete models are no longer active.