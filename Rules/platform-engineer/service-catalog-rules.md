# Service Catalog Rules

## Purpose
Maintain a trustworthy inventory of platform-managed services and ownership metadata.

## Scope
Applies to service catalogs, component metadata, ownership, dependencies, environments, and lifecycle state.

## MUST
- Catalog entries MUST identify accountable owners and lifecycle status.
- Metadata used for automation MUST have a defined schema and validation.
- Critical dependencies SHOULD be represented where operational decisions rely on them.
- Stale ownership and orphaned services MUST be detectable.

## MUST NOT
- MUST NOT treat unverified manually entered metadata as authoritative for security-sensitive automation.
- MUST NOT silently delete catalog history needed for incident or ownership investigation.

## SHOULD
- Prefer metadata synchronized from source-of-truth systems.
- Expose discoverable links to runbooks, repositories, and operational dashboards where appropriate.

## Exceptions
Manual metadata is acceptable when automation is unavailable, provided ownership and review cadence are explicit.

## Verification
Use schema validation, ownership audits, synchronization checks, orphan detection, and catalog-to-runtime reconciliation.