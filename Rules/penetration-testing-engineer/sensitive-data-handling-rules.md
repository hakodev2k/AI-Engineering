# Sensitive Data Handling Rules

## Purpose
Prevent penetration-testing evidence from becoming a secondary security incident.

## Scope
Applies to credentials, tokens, personal data, customer data, proprietary information, vulnerability evidence, packet captures, dumps, and reports.

## MUST
- MUST collect only the minimum sensitive data needed to establish a finding or engagement objective.
- MUST classify and protect evidence according to its sensitivity and the engagement requirements.
- MUST encrypt sensitive evidence in transit and at rest using approved mechanisms.
- MUST restrict evidence access to authorized participants and maintain an auditable transfer path.
- MUST redact reusable secrets and unnecessary personal data from reports and collaboration systems.
- MUST delete or return sensitive evidence according to the approved retention schedule.

## MUST NOT
- MUST NOT copy entire datasets when a bounded sample proves impact.
- MUST NOT place secrets in source control, public issue trackers, unapproved cloud storage, or plaintext chat.
- MUST NOT retain data indefinitely for convenience.
- MUST NOT reuse captured credentials outside authorized validation.

## SHOULD
- SHOULD use synthetic records and dedicated test accounts whenever they provide equivalent evidence.
- SHOULD maintain a data inventory for high-sensitivity engagements.

## Exceptions
Additional collection requires documented necessity, scope, retention, access controls, and owner approval.

## Verification
Inspect evidence inventories, storage encryption, access controls, transfer records, report redactions, retention dates, and deletion attestations.