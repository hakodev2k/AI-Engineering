# Network Security Architecture
## Purpose
Establish defensible network trust boundaries and security architecture.
## Scope
Enterprise, cloud, hybrid, datacenter, and edge networks.
## MUST
- Trust boundaries MUST be explicit and documented.
- Security controls MUST align to data sensitivity, threat model, and failure impact.
- Internet-facing and privileged management paths MUST have distinct protection requirements.
- Architecture changes MUST document dependencies, blast radius, and rollback.
## MUST NOT
- Flat-network assumptions MUST NOT substitute for segmentation design.
- Security MUST NOT depend on network location alone.
## SHOULD
- Designs SHOULD minimize implicit trust and unnecessary transitive reachability.
## Exceptions
Exceptions require documented rationale, compensating controls, risk owner, expiry, and verification.
## Verification
Review diagrams, route and policy configuration, threat models, reachability tests, and architecture decisions.