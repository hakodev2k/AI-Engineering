# Multi-Cloud and Portability Rules
## Purpose
Make portability decisions deliberate and economically justified.
## Scope
Provider abstraction, multi-cloud designs, migration readiness, interoperability, and lock-in.
## MUST
- Multi-cloud or portability requirements MUST identify concrete business, regulatory, resilience, or migration drivers.
- Provider-specific dependencies that materially affect exit cost MUST be documented for critical workloads.
- Portability claims MUST be validated at the layers where portability is actually required.
## MUST NOT
- MUST NOT duplicate platforms across providers merely to claim vendor neutrality without measurable benefit.
- MUST NOT hide provider coupling behind abstractions that add complexity without a credible migration path.
## SHOULD
- Accept beneficial managed-service coupling when its value exceeds documented switching risk.
## Exceptions
Exceptions require trade-off evidence, lifecycle expectations, and accountable decision ownership.
## Verification
Review architecture decisions, dependency inventories, migration assumptions, deployment artifacts, data portability, and tested recovery/migration procedures.