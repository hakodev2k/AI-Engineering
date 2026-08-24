# Data Quality Governance

## Purpose
Govern data quality through business-defined expectations, measurable controls, ownership, and sustainable remediation.

## When to use
Use for unreliable critical data, recurring defects, new data products, regulatory reporting, or quality-program design.

## Inputs
Critical data elements, business rules, incident history, schemas, profiles, consumers, SLAs/SLOs, ownership.

## Context to inspect
Inspect where defects originate, existing tests, consumer impact, data contracts, pipeline observability, and remediation workflows.

## Core knowledge
Quality is fitness for purpose. Dimensions such as accuracy, completeness, timeliness, validity, uniqueness, and consistency matter only when tied to business use. Controls should be placed near the earliest reliable detection point.

## Procedure
1. Prioritize critical data and use cases.
2. Define measurable expectations with consumers and owners.
3. Baseline current quality using profiling and incidents.
4. Set thresholds based on business impact.
5. Implement preventive and detective controls.
6. Assign issue ownership and severity rules.
7. Route failures with context and lineage.
8. Perform root-cause remediation rather than repeated cleansing.
9. Track exceptions and accepted risk.
10. Review trends, false positives, and control effectiveness.

## Decision points
Block pipelines only when bad data is more harmful than delayed data. Quarantine when isolation is feasible. Warn when risk is tolerable. Prefer source correction over downstream patches.

## Common failure patterns
Thousands of low-value rules, arbitrary thresholds, quality scores without business meaning, downstream cleansing loops, alert fatigue, and ownerless defects.

## Verification
Inject or replay representative defects, confirm controls detect them, routing reaches accountable owners, and repaired root causes prevent recurrence.

## Expected output
Quality requirements, rules, thresholds, ownership, issue workflow, dashboards, and remediation evidence.

## Stop conditions
Escalate when business expectations conflict, source systems cannot be corrected, or quality risk exceeds approved tolerance.