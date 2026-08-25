# Configuration and Calibration Rules
## Purpose
Ensure deployed behavior is attributable to controlled configuration and valid calibration.
## Scope
Robot parameters, limits, calibration artifacts, feature flags, and environment-specific settings.
## MUST
- Version safety-, control-, geometry-, and calibration-relevant configuration with traceable provenance.
- Validate configuration ranges, schema, compatibility, and required fields before activation.
- Tie calibration artifacts to applicable hardware identity and procedure.
- Provide rollback for consequential configuration changes where technically possible.
## MUST NOT
- Store unexplained production tuning values only on individual robots.
- Apply calibration from incompatible hardware without validated equivalence.
## SHOULD
- Separate immutable product defaults from deployment overrides and runtime state.
## Exceptions
Emergency configuration changes require documented reason, approval, post-change verification, and subsequent reconciliation into controlled configuration.
## Verification
Compare deployed configuration to source of truth; inspect validation, calibration records, hardware identity, diffs, and rollback tests.