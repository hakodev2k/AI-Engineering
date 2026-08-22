# Identity and Access Rules
## Purpose
Limit cloud access to authorized identities and required privileges.
## Scope
Human, workload, service, federation, and privileged identities.
## MUST
- Access MUST follow least privilege and be scoped to required resources and actions.
- Privileged access MUST be attributable, time-bounded where supported, and auditable.
- Workloads MUST use managed or short-lived identities instead of embedded long-lived credentials where practical.
## MUST NOT
- MUST NOT share privileged accounts or credentials.
- MUST NOT grant broad administrative roles merely to resolve deployment friction.
## SHOULD
- Separate human administration, automation, and workload identities.
- Periodically review unused and excessive permissions.
## Exceptions
Elevated access requires reason, scope, duration, risk, evidence, and approval.
## Verification
Inspect IAM policies, role assignments, access reviews, audit logs, credential age, federation configuration, and privileged-access records.