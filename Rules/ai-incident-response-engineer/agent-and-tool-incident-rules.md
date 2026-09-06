# Agent and Tool Incident Rules

## Purpose
Contain and investigate incidents where AI systems can invoke tools or perform consequential actions.

## Scope
Applies to agents, function calling, workflow execution, browser/computer actions, external APIs, automation, and delegated sub-agents.

## MUST
- Incident response MUST identify which actions were proposed, authorized, attempted, completed, failed, or retried.
- Tool credentials and permissions MUST be scoped to least privilege during normal and incident operation.
- High-impact agent actions MUST have auditable authorization and execution records.
- Containment MUST be capable of disabling or restricting dangerous tool classes when credible uncontrolled action is occurring.
- Investigators MUST evaluate retry loops, duplicate execution, idempotency, stale state, and authorization bypass when relevant.
- Potential external side effects MUST be reconciled against authoritative target-system records.

## MUST NOT
- Agent self-reports MUST NOT be treated as authoritative evidence that an external action succeeded or failed.
- Responders MUST NOT grant broader tool permissions to diagnose an incident without explicit need and approval.
- Destructive external actions MUST NOT be replayed merely for reproduction.

## SHOULD
- Use sandbox or dry-run environments for reproducing consequential workflows.
- Tool interfaces SHOULD expose stable correlation identifiers and idempotency controls.

## Exceptions
Emergency privilege elevation requires explicit human approval, bounded duration, audit logging, and prompt revocation after use.

## Verification
Review agent traces, tool audit logs, authorization records, target-system state, idempotency keys, and containment tests.