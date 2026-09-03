# Human Approval Gate Design

## Purpose
Insert reliable human authorization before agent actions whose impact, ambiguity, or reversibility makes fully autonomous execution unsafe.

## When to use
Use for financial transactions, destructive changes, privilege grants, external publication, sensitive communications, production changes, or other high-impact actions.

## Inputs
Action inventory, risk classification, user roles, approval UX, identity system, timeout rules, and rollback capability.

## Preconditions
Define which actions require approval and what information an approver needs to make an informed decision.

## Context to inspect
Tool invocation pipeline, authorization service, UI, notification channel, action preview, token/session binding, audit logs, and execution retries.

## Core knowledge
Approval must authorize a specific bounded action, not merely a vague agent plan. The approved parameters must be cryptographically or logically bound to the executed request so the agent cannot modify them after approval.

## Procedure
1. Classify actions by impact and reversibility.
2. Define deterministic criteria that trigger approval.
3. Generate a clear preview of exact target, parameters, side effects, and data disclosure.
4. Authenticate and authorize the approver independently of the model.
5. Bind approval to exact action parameters, actor, scope, and expiry.
6. Reject modified or expired requests.
7. Prevent approval replay.
8. Provide cancel and escalation paths.
9. Log requester, approver, approved parameters, timestamp, and final outcome.
10. Test race conditions, stale approvals, parameter substitution, replay, and multi-step plans.

## Decision points
Prefer machine policy for routine low-risk checks; use humans where context-dependent judgment is essential. Require multiple approvers only where governance or risk justifies the delay.

## Common failure patterns
Approving natural-language intent instead of exact parameters, indefinite approvals, approval links without authentication, model-controlled approver identity, and hidden side effects.

## Verification
Prove execution fails if parameters differ from the approved request and that expired or replayed approvals are rejected.

## Expected output
An approval policy, bound request format, UX requirements, audit schema, and abuse-case tests.

## Stop conditions
Escalate if exact side effects cannot be previewed or approval cannot be bound to the executed action.