# Ownership and Governance Rules

## Purpose
Ensure every production schema has accountable ownership and governed lifecycle decisions.

## Scope
Owners, approvers, stewardship, metadata, lifecycle state, and policy responsibility.

## MUST
- Every production subject MUST have an accountable owner.
- Ownership metadata MUST be maintained when teams reorganize or services transfer.
- Lifecycle state MUST distinguish active, deprecated, and retired contracts.
- High-impact policy changes MUST identify an accountable approver.
- Orphaned subjects MUST be investigated before modification or deletion.

## MUST NOT
- MUST NOT treat lack of ownership as permission to change or remove a schema.
- MUST NOT assign ownership only to an individual when a durable team or service owner exists.
- MUST NOT allow policy-critical metadata to drift from authoritative ownership records.

## SHOULD
- Automate owner validation against current team/service catalogs.
- Review orphaned or inactive subjects periodically.

## Exceptions
Temporary ownership delegation requires duration, scope, and recorded responsibility.

## Verification
Inspect registry metadata, ownership catalogs, deprecation records, and approval history.