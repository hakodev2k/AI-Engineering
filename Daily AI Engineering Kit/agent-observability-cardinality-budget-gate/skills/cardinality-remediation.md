# Cardinality Remediation Skill

## Purpose
Implement the smallest safe change that bounds a confirmed telemetry-cardinality risk without unnecessarily destroying observability.

## When to use
Only after investigation confirms a risky producer/dimension or an acceptance criterion explicitly requires bounded telemetry.

## Inputs
Confirmed finding, affected call site, value source, policy, nearby tests, host build/test commands, approval state.

## Preconditions
Concrete evidence exists and public-contract/production boundaries are known.

## Allowed tools
Repository read/edit, formatter/linter, host build/tests, scanner, sample analyzer.

## Constraints
Prefer localized changes. Do not broaden scope, change production exporter/sampling/retention settings, or weaken privacy/security controls.

## Process
1. Restate the confirmed failure mode and evidence.
2. Choose the least invasive bounded representation: route template, enum/allowlist, bucket, normalized status, operation name, boolean, capped category, or safe dimension removal.
3. Check dashboard/alert/SLO/external contract impact. Stop for approval if a breaking contract is required.
4. Implement only affected producer and directly necessary helpers/tests.
5. Add a focused test that feeds many unique raw values and proves emitted dimensions remain bounded when feasible.
6. Run formatting/linting required by the host.
7. Run relevant tests/build.
8. Run `scripts/scan-cardinality.py`.
9. Analyze a representative sample when available.
10. Inspect diff for accidental telemetry removal, sensitive fields, or unrelated changes.
11. Produce evidence for independent verification.

## Expected output
Minimal code/test changes, before/after dimension semantics, command evidence, and remaining risk.

## Verification
Not complete until independent verification confirms boundedness and applicable host checks pass.

## Failure handling
Diagnose build/test failures once; maximum two implementation retries total. Retry transient tool failure once. Stop before any approval-required action.

## Stop conditions
Successful verification handoff, exhausted retries, unresolved contract ambiguity, approval boundary, or environment/permission failure.
