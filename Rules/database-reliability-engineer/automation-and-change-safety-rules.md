# Automation and Change Safety Rules

## Purpose
Ensure database automation reduces toil without amplifying mistakes.

## Scope
Provisioning, maintenance scripts, orchestration, self-healing, scheduled jobs, and automated remediation.

## MUST
- Make automation idempotent or explicitly detect unsafe repeated execution.
- Validate target environment, scope, and prerequisites before destructive or privileged actions.
- Log material actions with correlation identifiers and outcomes.
- Provide dry-run, bounded rollout, or equivalent safety controls for high-impact automation.

## MUST NOT
- Do not allow automation to bypass approval boundaries for destructive production actions.
- Do not retry ambiguous write operations blindly.

## SHOULD
- Prefer small reversible steps with explicit stop conditions and health checks.

## Exceptions
Emergency automation changes require incident authority and retrospective review.

## Verification
Review code, CI tests, execution logs, permission boundaries, retry logic, and failure-injection tests.