# Safe Dependency Upgrade Workflow

## Flow

Trigger
↓
Collect repository context
↓
Analyze dependency impact
↓
Create upgrade plan
↓
Apply controlled changes
↓
Run verification
↓
Review risks
↓
Complete

## Retry Policy
Maximum 2 retries for transient build or network failures.

## Stop Conditions
Stop on unknown breaking changes, missing approvals, or failed verification.

## Definition of Done
- Upgrade applied
- Tests passed
- Diff reviewed
- Risks documented
