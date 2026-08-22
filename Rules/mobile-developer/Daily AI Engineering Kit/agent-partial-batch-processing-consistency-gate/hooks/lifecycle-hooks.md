# Lifecycle Hooks

## Pre-task scan
**Trigger:** before batch consistency analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-batch-consistency.py <repo> --output scan.json`. **Expected:** exit 0 no heuristic hits, exit 1 findings to review, exit 2 invalid invocation/input. **Blocking:** only exit 2 blocks context collection.

## Post-edit focused verification
**Trigger:** after batch/checkpoint/retry edits. **Preconditions:** project test/build command known. **Action:** run focused partial-failure and restart/retry tests, then build/static checks. **Expected:** counts reconcile, checkpoint is correct, successful item effects are not duplicated, failures remain observable. **Failure:** preserve evidence and diagnose; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** fix contract mismatch; never mark pass while validation fails. **Blocking:** yes.
