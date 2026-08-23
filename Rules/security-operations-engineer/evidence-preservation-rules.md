# Evidence Preservation Rules

## Purpose
Preserve reliable evidence for investigation, recovery, legal, and compliance needs.

## Scope
Logs, memory, disk images, cloud records, messages, identity events, and other incident artifacts.

## MUST
- Evidence MUST preserve source, acquisition time, collector, method, integrity metadata, and chain of custody when applicable.
- Volatile evidence MUST be prioritized when loss would materially impair investigation.
- Original evidence MUST be protected from uncontrolled modification.
- Collection MUST follow applicable authorization, privacy, and retention requirements.

## MUST NOT
- MUST NOT alter production artifacts merely to make analysis easier.
- MUST NOT claim forensic integrity without verifiable handling records.

## SHOULD
- Evidence SHOULD use cryptographic hashes and immutable storage where practical.

## Exceptions
Emergency collection deviations require documented necessity, risk, and later review.

## Verification
Review acquisition logs, hashes, custody records, retention settings, permissions, and incident evidence packages.