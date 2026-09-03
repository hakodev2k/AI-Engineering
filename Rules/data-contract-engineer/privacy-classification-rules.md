# Privacy Classification Rules

## Purpose
Ensure data contracts expose privacy obligations and handling constraints before consumption.

## Scope
Applies to fields and datasets containing personal, confidential, regulated, or otherwise sensitive information.

## MUST
- Sensitive fields MUST be classified according to the applicable project or organizational policy before broad publication.
- Contracts MUST communicate handling restrictions that materially affect storage, access, retention, or downstream use.
- Classification changes MUST trigger review of affected consumers and controls.
- Derived fields MUST be reviewed when transformations can preserve or recreate sensitive information.

## MUST NOT
- Sensitive fields MUST NOT be published as unclassified merely because they are technically accessible.
- Consumers MUST NOT be expected to infer sensitivity from field names alone.
- Masking or pseudonymization MUST NOT automatically be treated as removal of all privacy obligations.

## SHOULD
- Classification metadata SHOULD be machine-readable where platform support exists.
- Contract review SHOULD involve privacy or security specialists for uncertain high-risk cases.

## Exceptions
Exceptions require documented legal or policy basis, risk assessment, compensating controls, and authorized approval.

## Verification
Inspect contract metadata, data catalogs, access policies, retention configuration, sample transformations, and review records.