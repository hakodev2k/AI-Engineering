# Release Readiness

## Purpose
Make evidence-based go/no-go decisions before production exposure.

## When to use
Use for scheduled releases, high-risk changes, coordinated launches, or any process requiring explicit readiness assessment.

## Inputs
Change scope, test results, known defects, security findings, dependency status, migration plan, capacity signals, support coverage, observability, and recovery plan.

## Preconditions
Acceptance criteria and release ownership are defined.

## Context to inspect
Inspect CI evidence, unresolved defects, change risk, operational dashboards, feature flags, downstream dependencies, incident load, maintenance windows, and on-call availability.

## Core knowledge
Readiness is not a checklist ritual. Controls should correspond to plausible failure modes and release risk. Known risk can be accepted only by an appropriate owner with explicit rationale.

## Procedure
1. Summarize release scope and user impact.
2. Classify operational and business risk.
3. Verify required functional and non-functional evidence.
4. Review unresolved defects and security findings.
5. Confirm dependencies and compatibility.
6. Confirm migration and recovery readiness.
7. Confirm telemetry and alerting for changed behavior.
8. Confirm operator/support coverage.
9. Record exceptions and authorized risk acceptance.
10. Make and record go/no-go decision with evidence links.

## Decision points
Increase controls for high blast radius, irreversibility, novelty, or weak observability. Reduce ceremony for routine low-risk changes when automation provides equivalent evidence.

## Common failure patterns
Checkbox approval without reviewing evidence, treating all releases equally, ignoring known operational degradation, release pressure overriding unowned risks, and approving recovery plans that were never exercised.

## Verification
Confirm every mandatory criterion has current evidence, exceptions have owners, and release metadata links to the decision record.

## Expected output
A concise readiness record with risk, evidence, exceptions, decision, and accountable owners.

## Stop conditions
Do not release when critical evidence is missing, a blocking dependency is unhealthy, high-severity unresolved risk lacks acceptance, or recovery for a high-impact change is untested.