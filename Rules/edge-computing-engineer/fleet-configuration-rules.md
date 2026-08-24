# Fleet Configuration
## Purpose
Control configuration drift across heterogeneous edge fleets.
## Scope
Runtime, network, feature, and policy configuration.
## MUST
- Desired configuration MUST be versioned, attributable, and environment-scoped.
- Nodes MUST expose enough state to detect drift from desired configuration.
- High-risk production configuration changes MUST require human approval and rollback instructions.
## MUST NOT
- MUST NOT rely on undocumented manual changes as durable configuration.
- MUST NOT mix secrets into ordinary configuration artifacts.
## SHOULD
- Configuration rollout SHOULD be progressive and automatically halted on health regression.
## Exceptions
Emergency manual changes must be recorded and reconciled back into the authoritative configuration source.
## Verification
Compare desired versus reported state, audit changes, test rollback, and inspect secret references.