# Firewall Policy
## Purpose
Keep traffic enforcement explicit, minimal, reviewable, and reversible.
## Scope
Network, host, cloud, and application-aware firewall policy.
## MUST
- Rules MUST identify source, destination, service, purpose, and owner.
- Default-deny MUST apply where technically and operationally feasible.
- Temporary rules MUST have expiry criteria.
- High-risk policy changes MUST have peer review and rollback instructions.
## MUST NOT
- Unbounded source/destination/service combinations MUST NOT be introduced for convenience.
- Disabled or shadowed rules MUST NOT accumulate indefinitely.
## SHOULD
- Rulebases SHOULD be ordered and structured to reduce ambiguity and shadowing.
## Exceptions
Require evidence of necessity, bounded exposure, compensating controls, approval, and expiry.
## Verification
Run policy linting, shadow analysis, hit-count review, flow validation, and sampled connectivity tests.