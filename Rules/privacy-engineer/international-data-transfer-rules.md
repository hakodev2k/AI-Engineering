# International Data Transfer Rules

## Purpose
Control cross-border personal-data transfers and processing-location risk.

## Scope
Cloud regions, vendor access, support access, subprocessors, replication, backups, and remote administration across jurisdictions.

## MUST
- Cross-border transfers MUST be identified in data-flow and vendor records.
- Required transfer mechanisms and safeguards MUST be established before processing begins.
- Residency and location commitments MUST be technically and contractually verifiable where promised.
- New regions, subprocessors, or remote-access locations MUST trigger reassessment when they change transfer risk.
- Transfer exceptions MUST be documented with scope and expiry.

## MUST NOT
- MUST NOT infer residency solely from an account billing address or vendor headquarters.
- MUST NOT make contractual residency commitments without validating actual storage, replication, support, and backup behavior.

## SHOULD
- Prefer architectures minimizing unnecessary cross-border movement of sensitive data.

## Exceptions
Require documented basis, risk assessment, safeguards, owner, expiry, and approval.

## Verification
Inspect architecture, vendor region settings, contracts, subprocessor disclosures, access logs, backup locations, and transfer assessments.