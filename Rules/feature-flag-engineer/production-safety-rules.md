# Production Safety Rules

## Purpose
Prevent feature-flag operations from causing uncontrolled production impact.

## Scope
All production flag mutations and automation.

## MUST
- Production changes MUST be reversible where technically possible and have explicit verification signals.
- High-blast-radius changes MUST use staged exposure or authorized emergency procedure.
- Operators MUST inspect current state before mutation to avoid acting on stale assumptions.
- Production configuration changes with destructive, security, or contractual impact MUST require human approval.

## MUST NOT
- Forceful bulk changes MUST NOT be executed without scope validation.
- Production safety controls MUST NOT be disabled merely to unblock delivery.
- A successful API response MUST NOT be treated as proof that desired application behavior occurred.

## SHOULD
- Mutations SHOULD be idempotent or protected against duplicate execution where automation can retry.

## Exceptions
Emergency execution requires authorized incident context, minimal blast radius, and retrospective verification.

## Verification
Review audit logs, approval records, staged rollout evidence, application telemetry, and rollback tests.