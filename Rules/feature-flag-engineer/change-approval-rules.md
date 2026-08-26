# Change Approval Rules

## Purpose
Match human oversight to the blast radius and reversibility of flag changes.

## Scope
Production flag creation, targeting, exposure, defaults, and deletion.

## MUST
- Changes MUST be risk-classified before execution.
- High-risk changes affecting security, data integrity, broad production exposure, or contractual behavior MUST require authorized human approval.
- The system MUST distinguish analyze, recommend, prepare, and execute permissions.
- Emergency changes MUST retain an audit trail and receive post-action review.

## MUST NOT
- Automation or AI agents MUST NOT silently exceed granted execution authority.
- Approval MUST NOT be inferred from mere access to a tool.
- Breaking public behavior MUST NOT be activated without appropriate change approval.

## SHOULD
- Low-risk routine changes SHOULD use standardized automated policy gates.

## Exceptions
Incident authority may accelerate normal workflow when documented emergency policy permits.

## Verification
Inspect policy configuration, audit events, role permissions, approvals, and sampled production changes.