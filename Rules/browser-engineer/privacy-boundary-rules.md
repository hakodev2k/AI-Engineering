# Privacy Boundary Rules
## Purpose
Prevent browser features from creating unintended tracking, cross-site correlation, or sensitive-data exposure.
## Scope
Identifiers, storage, network state, permissions, timing, device APIs, and cross-site data flows.
## MUST
- New web-visible state MUST be evaluated for fingerprinting and cross-site correlation risk.
- Sensitive state MUST be partitioned or permission-gated according to the platform privacy model.
- Privacy-impacting changes MUST document data exposed, retention, recipients, and user control.
## MUST NOT
- MUST NOT expose stable high-entropy identifiers without an approved privacy basis.
- MUST NOT silently weaken partitioning to improve compatibility.
## SHOULD
- SHOULD minimize precision, lifetime, and scope of observable data.
## Exceptions
Exceptions require privacy review, threat analysis, and measurable compatibility justification.
## Verification
Use privacy tests, partitioning tests, entropy analysis, configuration inspection, and cross-site adversarial scenarios.