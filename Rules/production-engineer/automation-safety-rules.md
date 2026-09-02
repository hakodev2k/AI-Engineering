# Automation Safety Rules

## Purpose
Ensure production automation reduces toil without silently amplifying operational risk.

## Scope
Applies to deployment automation, remediation, scaling, maintenance, data operations, and scheduled production actions.

## MUST
- Production automation MUST have bounded scope, explicit preconditions, observable actions, and defined failure behavior.
- Destructive or privilege-changing automation MUST require appropriate human approval unless a specifically approved autonomous policy exists.
- Automated remediation MUST be idempotent or otherwise protected against repeated unsafe side effects.
- Automation MUST expose enough telemetry to determine what it changed and why.

## MUST NOT
- MUST NOT create self-healing loops that can repeatedly worsen an unknown failure.
- MUST NOT grant automation broader production privilege than required for its function.
- MUST NOT hide automation failures through unconditional retries or ignored exit states.

## SHOULD
- Prefer dry-run, rate-limit, circuit-breaker, and kill-switch controls for high-impact automation.
- Test automation failure modes before production enablement.

## Exceptions
Exceptions require documented risk, scope, compensating controls, and accountable approval.

## Verification
Inspect automation code, IAM permissions, audit logs, test results, retry limits, kill switches, and remediation history.
