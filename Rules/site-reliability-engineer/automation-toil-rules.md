# Automation and Toil Rules

## Purpose
Reduce repetitive operational work while preserving safety, clarity, and human control over high-risk actions.

## Scope
Applies to operational scripts, runbooks, remediation automation, scheduled jobs, and repetitive on-call work.

## MUST
- Recurring manual operational work MUST be measured when it consumes material engineering time.
- Automation affecting production MUST include validation, bounded scope, observable outcomes, and failure handling.
- High-risk automation MUST require explicit approval or enforce strong safety gates before destructive execution.
- Automated remediation MUST stop or escalate when preconditions are not met.
- Ownership and maintenance expectations MUST be defined for operational automation.

## MUST NOT
- MUST NOT automate an unsafe or poorly understood procedure merely to reduce manual effort.
- MUST NOT let automation silently expand privileges or affected scope.
- MUST NOT treat hidden recurring toil as normal on-call responsibility indefinitely.

## SHOULD
- Prioritize automation that reduces repetitive, interrupt-driven, low-value work.
- Prefer idempotent and dry-run-capable operational tooling.

## Exceptions
Temporary manual operation is acceptable when automation cost exceeds benefit; the decision SHOULD be revisited if frequency or risk increases.

## Verification
Review toil metrics, script behavior, audit logs, safety checks, dry-run output, ownership, and incident history.