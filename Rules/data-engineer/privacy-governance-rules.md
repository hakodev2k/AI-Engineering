# Privacy and Governance Rules
## Purpose
Ensure governed and personal data is handled according to defined policy and lifecycle requirements.
## Scope
Classification, retention, masking, deletion, residency, and governed datasets.
## MUST
- Sensitive datasets MUST have classification, owner, retention, and access rules.
- Deletion and retention requirements MUST propagate to derived data where applicable.
- Data masking or minimization MUST preserve only what the use case requires.
## MUST NOT
- MUST NOT copy sensitive data to lower environments without approved protection.
- MUST NOT retain governed data indefinitely without policy basis.
## SHOULD
- Prefer tokenization, masking, aggregation, or synthetic data for non-production use.
## Exceptions
Exceptions require policy owner approval and compensating controls.
## Verification
Inspect catalog metadata, retention jobs, masking rules, access evidence, and deletion tests.