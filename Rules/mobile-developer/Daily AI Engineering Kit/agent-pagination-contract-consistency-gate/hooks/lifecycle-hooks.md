# Lifecycle Hooks

## Pre-task scan
**Trigger:** before pagination analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-pagination.py <repo> --output pagination-scan.json`. **Expected:** JSON report; exit 0 no heuristic hits, exit 1 review findings, exit 2 invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Post-edit focused verification
**Trigger:** after pagination-related edits. **Preconditions:** project test/build commands known. **Action:** run pagination boundary and duplicate/gap tests, then build/static checks. **Expected:** documented ordering and continuity behavior proven with item identities. **Failure:** preserve output; diagnose deterministic failures before rerun; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before workflow completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** correct the assessment or underlying verification; never mark `pass` while validation fails. **Blocking:** yes.
