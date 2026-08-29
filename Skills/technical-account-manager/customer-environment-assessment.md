# Customer Environment Assessment

## Purpose
Build a reliable picture of the customer's deployed environment so recommendations and escalations are based on actual topology, configuration, dependencies, and operational constraints.

## When to use
Use when inheriting an account, preparing an architecture review, investigating recurring incidents, or before major changes.

## Inputs
Architecture diagrams, inventories, configuration summaries, integrations, support cases, operating procedures, and telemetry.

## Context to inspect
Versions, regions, network paths, identity, dependencies, customizations, data flows, quotas, observability, backup/recovery, and unsupported components.

## Core knowledge
Customer documentation often drifts from reality. Senior TAMs distinguish authoritative evidence from assumptions and identify environmental facts that materially affect supportability.

## Procedure
1. Collect current diagrams and inventories.
2. Validate critical facts against runtime or configuration evidence where possible.
3. Map production and non-production environments.
4. Document integrations and external dependencies.
5. Identify unsupported versions, customizations, or hidden single points of failure.
6. Record operational ownership and change controls.
7. Highlight unknowns that affect risk or troubleshooting.
8. Maintain the assessment after major changes.

## Decision points
Prioritize evidence collection around critical workloads and known risk. Avoid exhaustive inventory work that does not change decisions.

## Common failure patterns
Trusting stale diagrams, mixing environments, overlooking customer-managed dependencies, and documenting configuration without ownership or purpose.

## Verification
Cross-check representative configuration, telemetry, and operator feedback against the documented environment.

## Expected output
A current environment assessment with topology, dependencies, ownership, supportability concerns, and material unknowns.

## Stop conditions
Stop when access is prohibited, sensitive information requires restricted handling, or the customer cannot validate critical environment facts.