# Data Classification

## Purpose
Align backup handling with the sensitivity, criticality, and obligations of protected data.

## Scope
Backup datasets, metadata, catalogs, exports, archives, and restored copies.

## MUST
- Protection controls MUST inherit or exceed applicable source-data classification requirements.
- Sensitive backup locations MUST have access, encryption, retention, residency, and disposal controls appropriate to classification.
- Restored copies used for testing MUST be protected to the same applicable sensitivity level or transformed using approved de-identification.
- Classification changes MUST trigger review of backup policy and existing retained copies where required.

## MUST NOT
- MUST NOT treat backup data as less sensitive because it is operational rather than primary data.
- MUST NOT copy sensitive recovery data into uncontrolled test environments.
- MUST NOT expose catalogs or metadata that reveal sensitive asset information without authorization.

## SHOULD
- Classification SHOULD be propagated automatically from authoritative inventory where reliable.

## Exceptions
Exceptions require data-owner and security/privacy review, compensating controls, and expiry.

## Verification
Compare asset classification with repository controls, restore destinations, residency, retention, access permissions, and sampled recovery workflows.