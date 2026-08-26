# Data Quality Strategy

## Purpose
Define a risk-based, measurable data quality strategy that connects business-critical data to explicit controls, ownership, evidence, and remediation.

## When to use
Use when establishing or revising a quality program, onboarding a domain, or responding to recurring data incidents. Do not use as a substitute for domain-specific validation design.

## Inputs
Business processes, data products, SLAs/SLOs, schemas, lineage, incident history, consumer requirements, regulatory constraints, and ownership model.

## Preconditions
Identify accountable domain owners and obtain enough access to inspect representative data and pipelines.

## Context to inspect
Review sources, transformations, consumers, existing tests, observability, contracts, issue backlog, freshness expectations, and known failure modes. Do not assume all datasets deserve equal control intensity.

## Core knowledge
Quality is multidimensional: accuracy, completeness, validity, consistency, uniqueness, timeliness, and integrity. Controls should be proportional to business impact and placed near the earliest reliable detection point. Metrics need stable definitions, thresholds, owners, and response expectations.

## Procedure
1. Identify critical business decisions and workflows dependent on data.
2. Inventory critical data elements and products.
3. Map producers, transformations, storage, and consumers.
4. Rank failure impact and likelihood.
5. Define applicable quality dimensions per asset.
6. Establish measurable indicators and baselines.
7. Define SLOs, thresholds, and escalation rules.
8. Assign producer, platform, and domain responsibilities.
9. Choose preventive, detective, and corrective controls.
10. Prioritize controls at high-risk boundaries.
11. Define incident and remediation workflow.
12. Establish scorecards and review cadence.
13. Pilot on one critical domain and tune thresholds.
14. Expand only after controls demonstrate useful signal.

## Decision points
Prefer preventive contracts when producers can enforce semantics; use downstream detection when upstream control is unavailable. Use hard failures for correctness-critical invariants and warnings for uncertain or exploratory expectations. Favor a small set of actionable metrics over broad vanity coverage.

## Common failure patterns
Testing everything equally; ambiguous metric definitions; thresholds without baselines; no accountable owner; dashboards without response procedures; treating missing data as the only quality problem; allowing alert fatigue; measuring test counts instead of risk reduction.

## Verification
Verify critical assets have owners, quality dimensions, executable controls, thresholds, response paths, and evidence from test runs. Confirm incidents can be traced to the responsible component and that scorecards reflect consumer impact.

## Expected output
A prioritized quality strategy with critical assets, dimensions, SLOs, controls, ownership, escalation rules, and measurable adoption criteria.

## Stop conditions
Escalate when critical semantics are undefined, ownership cannot be established, required evidence is inaccessible, or proposed controls could block production without an approved failure policy.