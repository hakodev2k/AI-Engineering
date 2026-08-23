# Developer Portal and Service Catalog

## Purpose
Create a reliable discovery surface for services, ownership, documentation, operational links, and supported developer actions.

## When to use
Use when developers cannot find system owners, dependencies, docs, environments, or standard actions across many services.

## Inputs
Service inventory, ownership sources, repositories, deployment metadata, docs, APIs, and platform workflows.

## Context to inspect
Inspect source-of-truth systems, metadata freshness, access controls, catalog completeness, search behavior, and action integrations.

## Core knowledge
A portal is useful only when metadata is trustworthy and workflows save effort. Avoid becoming a manually curated second source of truth.

## Procedure
1. Define high-value discovery and action use cases.
2. Identify authoritative metadata sources.
3. Define minimal catalog schema and ownership.
4. Automate ingestion and freshness checks.
5. Connect docs, repositories, runtime, and observability links.
6. Add guarded self-service actions selectively.
7. Implement search and filters around real developer questions.
8. Measure completeness, freshness, and usage.

## Decision points
Federate metadata from authoritative systems rather than copying manually. Add portal actions only when they improve workflows over native tools.

## Common failure patterns
Manual stale catalogs, vanity dashboards, excessive mandatory metadata, weak authorization, and portal-only workflows that hide underlying ownership.

## Verification
Sample catalog entries against source systems, test access boundaries, and validate common discovery/action journeys with users.

## Expected output
A searchable, fresh, permission-aware catalog connected to authoritative systems and useful workflows.

## Stop conditions
Stop when authoritative ownership or metadata sources cannot be established.