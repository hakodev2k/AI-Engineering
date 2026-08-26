# AI System Inventory

## Purpose
Create and maintain a decision-grade inventory of AI systems, models, vendors, use cases, owners, dependencies, and risk attributes.

## When to use
Use for governance onboarding, portfolio discovery, audits, regulatory readiness, mergers, or when shadow AI is suspected.

## Inputs
Application catalogs, model registries, cloud accounts, procurement records, repositories, vendor contracts, data catalogs, owner interviews.

## Core knowledge
An inventory is useful only when records have scope criteria, ownership, provenance, lifecycle state, dependencies, and freshness controls.

## Procedure
1. Define what qualifies as an AI system and excluded cases.
2. Establish canonical identifiers and minimum metadata.
3. Discover systems from technical and business sources.
4. Reconcile duplicates and nested components.
5. Record owner, purpose, users, model/provider, data classes, deployment, integrations, and lifecycle state.
6. Attach preliminary risk attributes and applicable obligations.
7. Link supporting evidence and dependent systems.
8. Require owner attestation.
9. Automate discovery and stale-record alerts where feasible.
10. Reconcile periodically against source systems.

## Decision points
Track a model separately when it has independent ownership, lifecycle, or material risk; otherwise model it as a component of the governed system.

## Common failure patterns
Spreadsheet-only inventories, voluntary registration without discovery, stale owners, missing vendor AI, duplicate records, inventory entries with no evidence.

## Verification
Sample technical assets and procurement records in both directions and measure completeness, ownership, and freshness.

## Expected output
Auditable AI inventory with canonical records and reconciliation process.

## Stop conditions
Escalate when system ownership cannot be established or discovery requires unauthorized access.