# Routing Security
## Purpose
Protect routing control planes and prevent unintended traffic paths.
## Scope
Internal routing, BGP, route redistribution, filtering, and cloud routing.
## MUST
- Route advertisements and imports MUST be constrained to intended prefixes and peers.
- Route redistribution MUST be explicitly designed and bounded.
- Control-plane authentication and protection MUST be enabled where supported and justified.
- Critical routing changes MUST include impact analysis and rollback.
## MUST NOT
- Default routes or broad prefix acceptance MUST NOT be introduced without understanding trust impact.
- Route leaks MUST NOT be mitigated solely by operational convention.
## SHOULD
- External routing SHOULD use prefix and origin validation capabilities where available.
## Exceptions
Require documented topology constraints, risk, approval, and monitoring.
## Verification
Review route tables, filters, peer configuration, control-plane telemetry, and simulated failure behavior.