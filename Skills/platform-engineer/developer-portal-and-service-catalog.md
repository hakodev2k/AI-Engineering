# Developer Portal and Service Catalog

## Purpose
Provide discoverable ownership, documentation, lifecycle, and self-service entry points for software and platform resources.

## When to use
Use when teams struggle to find service owners, operational links, platform capabilities, or supported workflows.

## Inputs
Service inventory, ownership sources, metadata, documentation, platform APIs, and user research.

## Context to inspect
Repositories, deployment systems, observability, incident tooling, identity, catalogs, and metadata freshness.

## Core knowledge
A portal should aggregate trusted sources rather than become another manually maintained database. Metadata quality and ownership are core product concerns.

## Procedure
1. Identify high-value discovery journeys.
2. Define a minimal service metadata schema.
3. Integrate authoritative sources automatically.
4. Expose ownership, docs, runtime, SLO, and support links.
5. Connect self-service platform actions.
6. Validate permissions for sensitive metadata.
7. Detect stale or missing ownership.
8. Measure search success and workflow completion.

## Decision points
Centralize metadata only when no authoritative source exists; otherwise reference or synchronize it.

## Common failure patterns
Manual catalog entries, stale ownership, portal vanity features, duplicate documentation, and unrestricted sensitive data.

## Verification
Sample services resolve to correct owners and operational resources; self-service actions work under correct authorization.

## Expected output
A trusted portal/catalog with automated metadata, ownership, discovery, and platform entry points.

## Stop conditions
Stop when authoritative ownership cannot be established or sensitive metadata exposure is unresolved.