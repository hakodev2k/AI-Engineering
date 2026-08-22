# Production Change Rules
## Purpose
Control operational risk from changes to live AWS environments.
## Scope
Console, CLI, IaC, configuration, networking, IAM, data, and service changes.
## MUST
- Identify scope, dependencies, blast radius, verification, and recovery before material production changes.
- Preserve an audit trail of who changed what, when, and why.
- Require human approval before destructive data operations, infrastructure destruction, key deletion, broad access changes, or security weakening.
- Verify critical behavior after change using operational evidence.
## MUST NOT
- Force or improvise irreversible changes when required impact information is unknown.
- Declare success from deployment completion alone.
## SHOULD
- Prefer small, reversible, independently verifiable changes.
## Exceptions
Incident mitigation may use expedited approval but must record rationale, actions, evidence, and follow-up.
## Verification
Inspect change records, CloudTrail, IaC diffs, approvals, deployment evidence, health metrics, and recovery readiness.