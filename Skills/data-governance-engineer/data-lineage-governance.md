# Data Lineage Governance

## Purpose
Establish trustworthy lineage for impact analysis, compliance, quality investigation, and change management.

## When to use
Use for critical reporting, regulated data flows, complex pipelines, migration, incident investigation, or schema-change governance.

## Inputs
Pipeline definitions, query history, schemas, orchestration metadata, BI models, APIs, transformation code, critical-data inventory.

## Context to inspect
Inspect source-to-consumer flows, transformation boundaries, manual steps, lineage tooling, critical reports, and known blind spots.

## Core knowledge
Lineage can be system-, dataset-, column-, or field-level. Required granularity should follow risk and use case. Automated lineage is preferable but must expose confidence and gaps.

## Procedure
1. Define lineage use cases and critical scope.
2. Select required granularity.
3. Inventory metadata sources and unsupported hops.
4. Capture source, transformation, and consumer relationships automatically where possible.
5. Model manual/external transitions explicitly.
6. Link lineage to owners, classifications, terms, and quality controls.
7. Establish freshness and completeness expectations.
8. Validate high-risk paths against code and runtime evidence.
9. Use lineage in change and incident workflows.
10. Monitor broken edges and unknown origins.

## Decision points
Use column-level lineage for high-risk transformations and critical metrics; dataset-level may suffice for lower-risk discovery. Do not claim complete lineage where opaque external systems exist.

## Common failure patterns
Pretty diagrams without operational use, false completeness, stale lineage, ignoring manual exports, no transformation semantics, and excessive granularity everywhere.

## Verification
Trace representative critical outputs backward to sources and forward to consumers; compare lineage against runtime/code evidence and document gaps.

## Expected output
Validated lineage graph, coverage metrics, confidence/gap annotations, and operational integration rules.

## Stop conditions
Escalate when regulated lineage cannot be demonstrated, source access is unavailable, or evidence materially contradicts captured lineage.