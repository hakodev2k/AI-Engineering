# Production Change Approval Rules

## Purpose
Keep financial analysis separate from authority to alter production systems.

## Scope
Shutdowns, resizing, schedules, storage lifecycle, scaling limits, commitment-linked changes, configuration, and resource deletion.

## MUST
- Classify work as analyze, recommend, prepare, or execute and remain within granted authority.
- Require human approval before destructive, irreversible, customer-impacting, security-sensitive, or materially risky production actions unless a pre-approved automation policy explicitly covers them.
- Provide expected savings, operational impact, dependencies, rollback, validation, and owner before approval.
- Record execution and verify both service health and cost outcome.

## MUST NOT
- Delete production data or resources, weaken security controls, or bypass change governance to meet a savings target.
- Treat a cost recommendation as authorization to execute it.
- Force-push, rewrite history, or alter infrastructure state outside granted authority.

## SHOULD
- Prefer staged, reversible, observable changes during approved windows.

## Exceptions
Incident procedures may authorize emergency actions within predefined boundaries.

## Verification
Inspect approval records, change tickets, diffs, audit logs, rollback evidence, service telemetry, and post-change cost measurements.