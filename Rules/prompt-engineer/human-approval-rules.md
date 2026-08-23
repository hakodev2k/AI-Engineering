# Human Approval Rules

## Purpose
Keep consequential model behavior within explicitly authorized human decision boundaries.

## Scope
Prompts that can trigger financial, security, production, legal, contractual, destructive, or externally visible actions.

## MUST
- Workflows MUST identify which actions require human approval before execution.
- Approval prompts MUST present the proposed action, relevant evidence, material risks, and irreversible consequences clearly enough for informed review.
- Approval MUST be tied to the specific action or bounded action set being authorized.
- Materially changed action parameters after approval MUST require renewed approval when risk changes.

## MUST NOT
- MUST NOT treat prior generic consent as authorization for unrelated high-risk actions.
- MUST NOT obscure uncertainty, missing evidence, or side effects in approval requests.
- MUST NOT allow the model to approve its own escalation of authority.

## SHOULD
- Approval interfaces SHOULD separate recommendation from execution.
- Reversible preparation steps SHOULD be completed before asking for approval when this reduces reviewer burden without increasing risk.

## Exceptions
Pre-authorized low-risk actions may execute automatically when scope, limits, monitoring, and revocation are documented.

## Verification
Inspect authority matrices, approval records, parameter-binding behavior, escalation tests, and audit logs.