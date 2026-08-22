# Network Documentation and Source of Truth

## Purpose
Maintain trustworthy topology, addressing, inventory, ownership, and intent data that supports operations, automation, troubleshooting, and safe change.

## When to use
Use when onboarding networks, preparing changes, automating configuration, resolving documentation drift, or after architecture changes/incidents.

## Inputs
Device inventory, configurations, IPAM, diagrams, circuits, routing/VRF/VLAN data, cloud resources, owners, and monitoring metadata.

## Context to inspect
Inspect existing CMDB/IPAM/source-of-truth systems, generated versus manual data, naming conventions, automation dependencies, and stale artifacts.

## Core knowledge
Documentation is valuable when authoritative, scoped, and maintained by workflow. A source of truth should clearly distinguish intended state from discovered state and define conflict resolution.

## Procedure
1. Define which system owns each data domain.
2. Inventory required operational entities and relationships.
3. Establish naming and metadata conventions.
4. Import or reconcile current discovered state.
5. Represent topology, addressing, circuits, policy intent, and ownership.
6. Link change workflows to source-of-truth updates.
7. Generate diagrams/config where appropriate instead of duplicating data manually.
8. Detect drift between intended and live state.
9. Review stale/unowned records periodically.

## Decision points
Keep highly dynamic facts discovered automatically; keep business intent and allocations authoritative in managed systems. Avoid one giant CMDB if specialized systems can integrate reliably.

## Common failure patterns
Diagrams as the only source, duplicate conflicting inventories, undocumented ownership, manual updates after deployment, stale circuit data, and automation consuming unvalidated records.

## Verification
Sample live devices/resources against records, test automation inputs, validate ownership, and confirm recent changes are reflected without manual reconstruction.

## Expected output
A maintainable source-of-truth model and documentation workflow with clear authority and drift handling.

## Stop conditions
Escalate when multiple systems claim authority with no governance decision or reconciliation could overwrite trusted production data.