# Backup Integrity

## Purpose
Ensure stored recovery data is complete, readable, and trustworthy.

## Scope
Backup payloads, catalogs, checksums, chains, snapshots, media, and metadata.

## MUST
- Backup integrity MUST be validated beyond job exit status using checksums, application-aware validation, restore testing, or equivalent evidence appropriate to the workload.
- Broken chains, missing dependencies, unreadable media, and catalog inconsistencies MUST be treated as recoverability defects.
- Integrity failures affecting required restore points MUST be investigated and remediated within risk-based timelines.

## MUST NOT
- MUST NOT equate successful transfer with recoverability.
- MUST NOT suppress recurring corruption or verification failures without root-cause work.
- MUST NOT discard the last known-good copy during remediation.

## SHOULD
- Verification SHOULD sample different ages, storage tiers, and failure domains.
- Critical workloads SHOULD use automated integrity checks where feasible.

## Exceptions
Any reduced verification requires documented constraints, compensating restore tests, owner, and review date.

## Verification
Inspect checksum/verification reports, chain health, media errors, sampled restores, application consistency checks, and unresolved integrity incidents.