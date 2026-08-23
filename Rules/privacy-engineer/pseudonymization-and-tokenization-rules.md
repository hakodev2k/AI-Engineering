# Pseudonymization and Tokenization Rules

## Purpose
Reduce exposure of direct identifiers while preserving necessary processing capability.

## Scope
Analytics datasets, operational stores, test data, integrations, exports, and model pipelines.

## MUST
- Pseudonymous identifiers MUST be generated and managed so unauthorized parties cannot trivially reverse them.
- Re-identification keys or mappings MUST be access-controlled separately from pseudonymous data.
- Token formats MUST avoid embedding sensitive source values.
- Rotation, revocation, and collision behavior MUST be defined where tokens are long-lived or security-relevant.
- Residual linkability and re-identification risk MUST be assessed for high-dimensional datasets.

## MUST NOT
- MUST NOT label reversibly encoded identifiers as anonymized.
- MUST NOT store re-identification mappings beside broadly accessible pseudonymous datasets without explicit justification.

## SHOULD
- Use scoped tokens when cross-context correlation is unnecessary.

## Exceptions
Require rationale, risk analysis, compensating controls, owner, and approval.

## Verification
Inspect token generation, key storage, access policies, linkage paths, sample datasets, and re-identification tests.