# Secure Management Plane
## Purpose
Protect administrative control of network infrastructure.
## Scope
Device management, controllers, consoles, APIs, bastions, and out-of-band networks.
## MUST
- Management access MUST be restricted to authorized identities and paths.
- Privileged actions MUST be attributable to individual operators or service identities.
- Management protocols MUST use approved secure transport.
- Administrative configuration changes MUST be logged and recoverable.
## MUST NOT
- Default credentials MUST NOT remain active.
- Management services MUST NOT be exposed broadly to user or Internet networks.
## SHOULD
- Out-of-band management SHOULD be isolated from production data paths where feasible.
## Exceptions
Require security approval, bounded scope, compensating controls, and remediation date.
## Verification
Review exposure, AAA configuration, privilege assignments, management protocols, audit logs, and recovery access.