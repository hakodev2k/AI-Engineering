# Data Export and Egress Rules

## Purpose
Control high-risk movement of database data beyond its normal processing boundary.

## Scope
Covers dumps, CSV/JSON exports, query downloads, ETL extracts, object storage, clipboard/tool exports, and cross-system transfers.

## MUST
- Sensitive exports MUST have an authorized purpose, accountable owner, bounded destination, and appropriate protection.
- Export permissions MUST be separate from ordinary read access when the platform or surrounding system supports it.
- Large or unusual sensitive-data egress MUST be auditable and monitored according to risk.
- Temporary export artifacts MUST have retention and secure deletion expectations.
- Destinations MUST meet the source data's security classification before transfer.

## MUST NOT
- Sensitive data MUST NOT be exported to personal, unmanaged, or unapproved storage.
- Encryption MUST NOT be used as justification for uncontrolled destination access.
- Bulk production exports MUST NOT be executed by an AI agent or automation without explicit authority when they create material exposure.

## SHOULD
- Minimize fields and rows to the approved purpose.
- Prefer controlled data-sharing mechanisms over ad hoc dumps.

## Exceptions
Exceptions require purpose, data scope, destination, duration, controls, monitoring, and data-owner/security approval.

## Verification
Review export-capable grants, query/audit logs, destination ACLs, transfer encryption, DLP/detection events, retention settings, and sampled export contents.