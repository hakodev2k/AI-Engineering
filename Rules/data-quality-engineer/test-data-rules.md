# Test Data Rules
## Purpose
Make data-quality testing representative, safe, and reproducible.
## Scope
Fixtures, synthetic data, production-derived samples, masking, and edge cases.
## MUST
- Test data MUST cover critical domain states and known failure modes.
- Production-derived data MUST comply with privacy, access, retention, and masking requirements.
- Fixtures MUST be versioned with the behavior they validate.
## MUST NOT
- MUST NOT copy unrestricted production sensitive data into lower environments.
- MUST NOT depend on mutable shared fixtures for deterministic tests.
## SHOULD
- Synthetic datasets SHOULD preserve relevant distributions and constraints without reproducing sensitive identities.
## Exceptions
Restricted production samples require explicit authorization and controlled handling.
## Verification
Inspect fixture provenance, privacy controls, edge-case coverage, reproducibility, and access permissions.