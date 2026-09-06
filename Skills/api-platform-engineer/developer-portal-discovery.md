# Developer Portal and API Discovery

## Purpose
Make APIs discoverable, understandable, and consumable through a reliable developer portal and catalog.

## When to use
Use when API onboarding is slow, ownership is unclear, documentation is fragmented, or a platform catalog is being built.

## Inputs
API inventory, schemas, ownership metadata, onboarding workflows, authentication requirements, consumer feedback.

## Context to inspect
Inspect current docs, catalogs, examples, support channels, provisioning steps, and stale ownership records.

## Core knowledge
A portal is useful only when metadata is authoritative and connected to delivery workflows. Documentation generated from contracts should be supplemented with concepts, examples, lifecycle status, ownership, and access instructions.

## Procedure
1. Define required catalog metadata.
2. Establish authoritative ownership and lifecycle fields.
3. Ingest machine-readable contracts automatically.
4. Publish authentication and onboarding procedures.
5. Add tested examples and common workflows.
6. Expose environments, base URLs, limits, and support contacts.
7. Show version/deprecation status prominently.
8. Automate freshness from CI/CD where possible.
9. Add search and domain classification.
10. Measure discovery and time-to-first-success.

## Decision points
Generate reference docs from schemas; hand-author conceptual guidance. Prefer federated ownership with centralized metadata requirements.

## Common failure patterns
Stale docs, undocumented prerequisites, copy-paste examples that fail, unclear ownership, and portals disconnected from source contracts.

## Verification
Have a new consumer discover an API, obtain access, execute a valid request, and locate troubleshooting guidance using the portal alone.

## Expected output
A trustworthy API catalog that reduces onboarding and support cost.

## Stop conditions
Stop when no authoritative owner or contract exists for APIs intended for publication.