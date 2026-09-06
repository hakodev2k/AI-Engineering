# Vendor Platform Selection and Portability

## Purpose
Select workflow automation platforms and connectors based on functional fit, reliability, governance, economics, and exit cost rather than feature demos alone.

## When to use
Use when choosing or replacing an automation platform, managed orchestrator, integration service, RPA product, AI workflow framework, or critical connector.

## Inputs
Use cases, volume, latency, deployment model, security requirements, integration inventory, team skills, budget, compliance constraints, and portability requirements.

## Context to inspect
Inspect platform execution semantics, version control, testing support, APIs, custom-code escape hatches, credential model, observability, data residency, limits, pricing, export formats, support history, and deprecation policy.

## Core knowledge
Platform value includes delivery speed and operational leverage, while platform risk includes proprietary definitions, connector behavior, hidden retries, weak environment promotion, data egress, and pricing tied to executions or steps. Portability is a spectrum, not an all-or-nothing property.

## Procedure
1. Define must-have requirements and explicitly weighted decision criteria.
2. Separate current needs from speculative future features.
3. Create representative workflows including failures and long-running state.
4. Evaluate integration depth, custom logic, testing, observability, security, and deployment controls.
5. Validate rate limits, execution semantics, and retry behavior empirically.
6. Model cost at normal and peak volume including AI/API usage.
7. Assess data residency, retention, backups, and auditability.
8. Identify proprietary constructs and extraction/export options.
9. Estimate migration effort for the highest-value workflows.
10. Evaluate vendor reliability, support, roadmap, and deprecation practices.
11. Run a proof of concept that includes failure recovery, not only happy paths.
12. Record the decision and exit strategy.

## Decision points
Prefer managed platforms when operational leverage outweighs control needs. Prefer code-centric orchestration when testing, portability, complex state, or deep customization dominate. Use multiple platforms only when boundaries are operationally justified.

## Common failure patterns
Selecting by connector count, ignoring execution pricing, relying on undocumented nodes, no source-control story, and discovering export/migration limitations after adoption.

## Verification
Demonstrate representative workflows, recovery, release promotion, auditing, and cost estimates with real platform behavior before commitment.

## Expected output
A decision record with weighted criteria, proof-of-concept evidence, cost model, risks, portability assessment, and exit plan.

## Stop conditions
Stop when security/compliance requirements cannot be validated, critical platform behavior is undocumented and untestable, or projected economics depend on unverified pricing assumptions.