# Lifecycle Hooks

## Pre-task static scan
**Trigger:** before investigation. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-n-plus-one.py <repo> --output scan.json`. **Expected:** JSON report; exit 0 means no heuristic hits, 1 means hits require review, 2 means invalid input. **Blocking:** only exit 2 blocks context collection.

## Post-edit performance verification
**Trigger:** after EF Core query-shape edits. **Preconditions:** representative scenario and focused tests are known. **Action:** run focused tests plus query-count scenario with the same dataset/input. **Expected:** business result equivalent and query count not increased. **Failure:** preserve logs/query counts; diagnose before rerun; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** correct the assessment or underlying verification; never mark pass while validation fails. **Blocking:** yes.
