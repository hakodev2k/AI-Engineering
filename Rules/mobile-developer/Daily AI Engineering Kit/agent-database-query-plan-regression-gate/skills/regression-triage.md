# Skill: Query Plan Regression Triage

## Purpose
Turn a failed plan gate into a bounded, evidence-driven fix.

## Inputs
Analyzer report, plans, SQL, source diff, functional tests.

## Procedure
1. Read failed findings and classify: cost, cardinality, new sequential/table scan, join/operator change, or invalid comparison.
2. Map the affected plan node to SQL and source expression.
3. Form one hypothesis at a time, such as non-sargable predicate, projection expansion, changed join, missing selective predicate, pagination/order change, or parameter sensitivity.
4. Validate the hypothesis using plan evidence and source—not intuition.
5. Prefer the smallest code/query-shape change preserving behavior.
6. Do not create/modify an index or schema without approval.
7. Run functional tests.
8. Recapture candidate evidence and rerun the gate.
9. Retry the fix cycle at most twice.
10. If still failing, stop and report findings, evidence, attempted fixes, and approval-dependent options.

## Expected output
Confirmed cause or bounded unresolved hypothesis, changed files, new report, functional verification.

## Verification
A fix is accepted only if functional behavior remains correct and deterministic gates pass under comparable evidence.

## Failure handling
Transient tool failures: max two retries. Functional or gate failures: investigate; do not repeatedly rerun unchanged commands.

## Stop conditions
Two failed fix cycles, approval boundary reached, non-comparable environment, or evidence contradicts the proposed fix.