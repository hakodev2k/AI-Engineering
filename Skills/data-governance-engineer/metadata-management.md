# Metadata Management

## Purpose
Design metadata practices that make data understandable, discoverable, governable, and traceable at scale.

## When to use
Use for catalog programs, platform onboarding, governance automation, lineage initiatives, or poor data discoverability.

## Inputs
Asset inventory, platform architecture, schemas, catalog capabilities, governance policies, user journeys, ownership model.

## Context to inspect
Inspect technical metadata sources, business metadata, operational metadata, current catalog coverage, APIs, scanners, and metadata freshness.

## Core knowledge
Metadata includes business, technical, operational, governance, and lineage information. Automated harvesting reduces toil, while business meaning and accountability often require stewardship. Metadata must have quality SLOs of its own.

## Procedure
1. Define priority metadata use cases.
2. Identify required attributes and relationships.
3. Map authoritative metadata sources.
4. Define metadata ownership and stewardship.
5. Establish naming, identifiers, lifecycle states, and minimum completeness.
6. Automate harvesting and synchronization.
7. Integrate glossary, classification, ownership, quality, and lineage.
8. Define manual enrichment only where automation cannot infer meaning.
9. Monitor freshness, completeness, duplicates, and broken links.
10. Validate search and impact-analysis workflows with users.

## Decision points
Harvest metadata automatically when systems expose reliable sources; require human curation for semantics and accountability. Avoid collecting attributes with no consumer or control use case.

## Common failure patterns
Catalog as documentation graveyard, stale ownership, duplicate assets, manual metadata at scale, no stable identifiers, and measuring success by asset count alone.

## Verification
Verify representative assets are searchable, current, linked to owners and definitions, and support lineage/impact or control workflows as intended.

## Expected output
Metadata model, source mappings, harvesting design, stewardship rules, quality metrics, and lifecycle process.

## Stop conditions
Escalate when authoritative metadata sources cannot be identified or mandatory metadata cannot be obtained within platform constraints.