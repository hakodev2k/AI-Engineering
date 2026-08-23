# Third-Party Processing Rules

## Purpose
Control privacy risk introduced by vendors, processors, partners, and subprocessors.

## Scope
External services that receive, store, access, infer, or otherwise process personal data.

## MUST
- Third-party processing MUST have an accountable internal owner and documented purpose.
- Data shared MUST be limited to what the third party needs.
- Required contractual privacy, confidentiality, security, deletion, audit, and subprocessor terms MUST be in place before production use.
- Material vendor changes, subprocessors, or processing locations MUST trigger reassessment where relevant.
- Offboarding MUST include access revocation, data return/deletion obligations, and evidence.

## MUST NOT
- MUST NOT send production personal data to unapproved tools or accounts.
- MUST NOT assume a vendor's marketing claims satisfy privacy requirements.

## SHOULD
- Prefer vendors supporting granular controls, export, deletion, residency, and auditable configuration.

## Exceptions
Exceptions require documented risk, owner, compensating controls, expiry, and approval.

## Verification
Inspect contracts, data-flow records, vendor assessments, configurations, subprocessor lists, and offboarding evidence.