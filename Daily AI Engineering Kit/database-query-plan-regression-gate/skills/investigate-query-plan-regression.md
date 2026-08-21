# Skill: Investigate Query Plan Regression

## Purpose
Turn a deterministic regression signal into a bounded, evidence-driven investigation and smallest safe remediation.

## Inputs
- Baseline/candidate evidence.
- Comparator output.
- Original plans.
- Relevant SQL/ORM code, schema/index definitions, statistics/context, and tests.

## Procedure
1. Read comparator blockers/warnings before opening unrelated repository areas.
2. Trace the changed SQL or ORM query shape and parameterization.
3. Inspect operator deltas: scans, sorts, hashes, lookups, spills.
4. Compare estimated vs actual rows to identify cardinality-estimate drift.
5. Compare logical reads, CPU, and duration separately; do not collapse them to one optimizer cost.
6. Form one hypothesis at a time: predicate/index mismatch, join order, parameter sensitivity, statistics, projection expansion, N+1/query split, provider translation, or data-shape change.
7. Validate each hypothesis with repository evidence and a controlled plan capture.
8. Prefer the smallest code/query change that restores acceptable behavior.
9. If remediation requires index/schema/statistics/config changes, stop for human approval before applying them to protected environments.
10. Re-capture candidate evidence from the new source revision.
11. Re-run comparison and inspect the final diff.

## Expected output
- Confirmed findings with evidence.
- Remediation applied or approval request.
- New comparison result.
- Remaining risks.

## Verification
A remediation is complete only when the final gate returns `verified`; generated SQL or a successful build alone is insufficient.

## Failure handling
Transient capture failures retry once. Repeated tool failures, incomparable environments, ambiguous production-only regressions, or approval-required actions stop and preserve evidence.
