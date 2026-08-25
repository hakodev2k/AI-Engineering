# Self-Service BI Governance

## Purpose
Enable decentralized analysis while preserving trusted definitions, security, discoverability, and manageable platform operations.

## When to use
Use when business users create reports/models or when centralized BI cannot scale to all analytical demand.

## Inputs
User personas, platform capabilities, certified datasets, governance policy, security model, support capacity, usage telemetry.

## Context to inspect
Inspect workspace ownership, dataset duplication, permissions, refresh failures, unused assets, naming, certification, and support incidents.

## Core knowledge
Self-service succeeds with paved roads: governed reusable data products, clear ownership, safe permissions, discoverability, lifecycle controls, and escalation paths. Excessive restriction drives shadow analytics; no governance destroys trust.

## Procedure
1. Segment creators by capability and risk.
2. Define supported self-service use cases and boundaries.
3. Publish certified semantic models and metric definitions.
4. Establish workspace, naming, ownership, and access standards.
5. Provide templates and documented patterns for common analysis.
6. Define promotion/certification criteria for widely consumed assets.
7. Monitor duplication, refresh health, sharing, and usage.
8. Establish archival and ownership-transfer processes.
9. Train creators on grain, joins, metric reuse, security, and validation.
10. Review governance using observed friction and incidents.

## Decision points
Centralize high-risk enterprise metrics and shared semantic models; decentralize presentation and local analysis where blast radius is limited.

## Common failure patterns
Uncontrolled copies, personal credentials in refreshes, orphaned reports, unclear certification, over-permissioned workspaces, and governance based only on documentation.

## Verification
Audit representative assets for ownership, certified-source usage, access, freshness, and duplication; track adoption of governed models and reduction in metric disputes.

## Expected output
A practical self-service operating model with paved datasets, controls, lifecycle, training, and measurable governance signals.

## Stop conditions
Stop when platform permissions cannot enforce required policy or no owner exists for shared analytical assets.