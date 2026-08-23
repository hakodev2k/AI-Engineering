# Incident Automation Rules

## Purpose
Use automation to accelerate response without allowing tools or AI agents to exceed safe authority.

## Scope
Bots, remediation workflows, scripts, orchestration, diagnostic agents, and AI-assisted incident response.

## MUST
- Define automation permissions, target scope, preconditions, idempotency expectations, audit logging, and failure behavior.
- Separate analyze, recommend, prepare, and execute capabilities.
- Require human approval before automation performs project-defined high-risk production, security, data, or public-contract changes.
- Validate tool output against actual system state after consequential execution.
- Provide bounded retries and safe termination conditions.

## MUST NOT
- Treat agent confidence as evidence or authorization.
- Allow automation to expand its own privileges, bypass approvals, or execute destructive actions from untrusted incident content.
- Feed secrets or unrestricted sensitive data into tools without explicit authorization and controls.

## SHOULD
- Automate evidence gathering and reversible diagnostics before automating dangerous remediation.

## Exceptions
Pre-approved automatic remediation may execute without per-event approval only when blast radius, safeguards, rollback, and monitoring are explicitly governed.

## Verification
Inspect permission scopes, workflow definitions, approval gates, audit logs, retry limits, injection defenses, and post-execution validation.