# Metadata Catalog and Lineage

## Purpose
Build metadata and lineage capabilities that make datasets discoverable, attributable, governable, and diagnosable across the platform.

## When to use
Use when data discovery is slow, ownership is unclear, impact analysis is manual, or governance requires traceability.

## Inputs
Data assets, orchestration metadata, query logs, contracts, ownership model, classification policy, and supported engines.

## Context to inspect
Catalogs, registries, transformation definitions, BI/ML consumers, naming conventions, lineage emitters, and metadata freshness.

## Core knowledge
Useful metadata combines technical, operational, and business context. Automated lineage is preferable to manually maintained diagrams but must expose confidence and gaps. A catalog without ownership and workflows becomes stale inventory.

## Procedure
1. Define asset types and minimum metadata standard.
2. Establish stable identifiers across systems.
3. Automate harvesting from storage, compute, orchestration, and query engines.
4. Capture column-level lineage where critical and feasible.
5. Attach owners, contracts, classifications, freshness, and quality signals.
6. Define glossary terms separately from physical schemas.
7. Provide search and dependency navigation.
8. Add stale-asset and missing-owner detection.
9. Integrate lineage into change review and incident response.
10. Measure metadata coverage and freshness.

## Decision points
Use column lineage for high-impact transformations; dataset-level lineage may be sufficient elsewhere. Prefer automated extraction, supplemented by manual semantics that tools cannot infer.

## Common failure patterns
Catalog-as-documentation-project, duplicate asset identities, stale ownership, lineage that ignores dynamic SQL, overclaiming inferred lineage, and no workflow integration.

## Verification
Trace representative source-to-dashboard paths, compare lineage with actual execution, validate owner routing, test impact analysis for a proposed schema change, and measure metadata freshness.

## Expected output
Searchable catalog, lineage graph, ownership/classification metadata, coverage metrics, and operational integration.

## Stop conditions
Escalate when authoritative ownership cannot be established, lineage sources are inaccessible, or sensitive metadata exposure violates policy.