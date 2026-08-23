# Automation Guardrail Rules

## Purpose
Automate FinOps controls safely without allowing cost tooling to create uncontrolled production impact.

## Scope
Schedulers, cleanup jobs, policy engines, auto-rightsizing, quota controls, alerts, remediation bots, and AI-assisted FinOps actions.

## MUST
- Define automation authority, scope, preconditions, maximum impact, exclusions, rollback, logging, and owner.
- Make destructive or customer-impacting automation opt-in through explicit approved policy.
- Use idempotent operations where practical and handle retries without multiplying impact.
- Emit audit evidence for decisions and actions and alert on failed or partial remediation.
- Test automation against representative non-production scenarios before production enablement.

## MUST NOT
- Give an AI agent implicit authority to execute destructive recommendations.
- Disable safety checks to improve savings throughput.
- Allow unbounded loops, recursive triggers, or uncontrolled resource deletion.

## SHOULD
- Start in report-only mode and progressively expand authority after evidence demonstrates safety.

## Exceptions
Pre-authorized emergency controls may act automatically within explicitly bounded conditions.

## Verification
Inspect policy configuration, tests, dry-run results, permissions, audit logs, failure handling, rollback drills, and production action samples.