# Environment Fidelity Rules
## Purpose
Ensure performance evidence reflects the system being judged.
## Scope
Test environments, infrastructure, runtime versions, configuration, datasets, and dependencies.
## MUST
- Document material differences between test and production environments.
- Match production-relevant runtime, configuration, topology, and data characteristics where feasible.
- Account for noisy neighbors and shared-resource interference.
## MUST NOT
- Present results as production capacity when environment differences invalidate that inference.
- Compare runs across materially different environments without normalization or qualification.
## SHOULD
- Automate environment capture with each result.
## Exceptions
Lower-fidelity tests are valid for directional experiments when limitations are explicit.
## Verification
Compare environment manifests, runtime/configuration, resource limits, datasets, and dependency topology.