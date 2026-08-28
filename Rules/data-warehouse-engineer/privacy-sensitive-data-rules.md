# Privacy and Sensitive Data Rules

## Purpose
Prevent inappropriate collection, exposure, retention, or propagation of sensitive analytical data.

## Scope
Applies to personal data, confidential attributes, tokenized data, masked views, exports, and warehouse copies.

## MUST
- Sensitive attributes MUST be classified before broad warehouse distribution.
- Collection and retention MUST be limited to documented analytical, operational, or regulatory needs.
- Masking, tokenization, or de-identification controls MUST preserve required privacy guarantees through downstream models.
- Exports of sensitive data MUST be authorized and traceable.

## MUST NOT
- MUST NOT copy sensitive fields into convenience marts without a documented need.
- MUST NOT assume hashing alone provides anonymity when re-identification remains practical.

## SHOULD
- Prefer minimizing sensitive data at ingestion when downstream use does not require it.
- Retention SHOULD be enforceable through automated lifecycle controls where practical.

## Exceptions
Exceptions require purpose, data-owner approval, risk assessment, scope, and expiry.

## Verification
Inspect classifications, schemas, masking policies, retention jobs, access logs, and sampled downstream lineage.