# Metadata and Configuration Rules

## Purpose
Keep deployable behavior explicit, reviewable, and portable across Salesforce environments.

## Scope
Applies to custom metadata, custom settings, labels, feature configuration, permission metadata, and environment-specific values.

## MUST
- Configuration that affects application behavior MUST have a documented owner, default, and failure mode.
- Environment-specific values MUST be separated from reusable source-controlled behavior.
- Configuration changes with security, financial, or workflow impact MUST be reviewed and tested before production use.
- Code consuming configuration MUST define behavior for missing or invalid values.

## MUST NOT
- MUST NOT hide credentials or secrets in ordinary configuration metadata.
- MUST NOT encode production record IDs when stable keys or metadata references are available.
- MUST NOT allow unvalidated configuration to trigger irreversible operations.

## SHOULD
- Custom Metadata Types SHOULD be preferred for deployable configuration where suitable.
- Feature activation SHOULD be reversible when operational risk is material.

## Exceptions
Exceptions require documented platform constraint, risk, and migration plan.

## Verification
Review metadata diffs, environment mappings, default handling, negative tests, and permission boundaries.