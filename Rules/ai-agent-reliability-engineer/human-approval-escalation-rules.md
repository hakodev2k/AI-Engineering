# Human Approval and Escalation Rules

## Purpose
Ensure consequential agent actions remain within delegated authority and uncertain situations reach an accountable human before harmful execution.

## Scope
Applies to production changes, destructive actions, external communications, financial or legal effects, access changes, security controls, sensitive data, and other high-impact decisions.

## MUST
- Approval policy MUST define which actions require human authorization before execution.
- Approval requests MUST describe the proposed action, target, expected side effects, relevant evidence, material risks, and rollback or recovery path where applicable.
- An approval MUST be bound to the specific action scope and material parameters that were reviewed.
- Material changes to the approved plan MUST invalidate or renew the approval before execution.
- Unresolved uncertainty about authority, target identity, destructive impact, or policy compliance MUST trigger escalation rather than autonomous execution.
- Approval records MUST identify the approver, decision, scope, and time.

## MUST NOT
- An agent MUST NOT approve its own high-risk action.
- Ambiguous approval MUST NOT be interpreted as broader permission than explicitly granted.
- Prior approval for a similar action MUST NOT be reused when the target or material risk has changed.
- Urgency MUST NOT silently eliminate mandatory approval controls.

## SHOULD
- Approval interfaces SHOULD present the minimum evidence needed for an informed decision without overwhelming the reviewer.
- Escalation paths SHOULD name an accountable role or queue and define what happens while approval is pending.

## Exceptions
Emergency procedures may alter normal approval sequencing only when explicitly authorized by documented policy, with bounded authority, retrospective review, and complete audit evidence.

## Verification
Test approval-required paths, stale approval rejection, changed-parameter invalidation, denied approval, missing approver, and escalation behavior. Inspect production audit records for scope fidelity.