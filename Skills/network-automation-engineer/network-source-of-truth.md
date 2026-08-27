# Network Source of Truth

## Purpose
Establish an authoritative, machine-readable network inventory and intent model that automation can trust.

## When to use
Use before automating provisioning, compliance, addressing, topology, or configuration generation.

## Inputs
Device inventory, sites, roles, interfaces, circuits, IPAM, VLAN/VRF data, ownership, and desired-state conventions.

## Context to inspect
Existing CMDB/IPAM, controller databases, spreadsheets, discovery data, naming standards, and drift sources.

## Core knowledge
Automation is unsafe when multiple systems claim authority. Separate intended state from observed state and define ownership per field/domain.

## Procedure
1. Inventory current data sources and owners.
2. Define canonical entities, identifiers, relationships, and required fields.
3. Assign authority for each data domain.
4. Normalize naming, addressing, and lifecycle states.
5. Import existing data with validation and duplicate detection.
6. Reconcile observed devices against intended records.
7. Expose stable APIs or structured exports.
8. Add schema validation and change auditing.
9. Integrate automation as a consumer, not a competing authority.
10. Define drift and stale-record workflows.

## Decision points
Prefer one authoritative system per domain; federate only when organizational boundaries require it. Discovery may populate observed state but should not silently redefine intent.

## Common failure patterns
Spreadsheet shadow inventories, mutable natural keys, duplicate device identities, automation writing directly to discovered state, and undocumented field ownership.

## Verification
Reconcile sampled devices end to end, validate schemas, test lifecycle transitions, and prove automation reads consistent intended state.

## Expected output
Canonical data model, ownership rules, validated inventory, API contract, and reconciliation workflow.

## Stop conditions
Stop when authority is disputed, identifiers are ambiguous, or destructive automation would depend on unverified inventory.