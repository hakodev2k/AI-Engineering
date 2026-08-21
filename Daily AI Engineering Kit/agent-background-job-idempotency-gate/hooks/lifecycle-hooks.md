# Lifecycle Hooks

## Pre-task scan
**Trigger:** before idempotency analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-idempotency.py <repo> --output scan.json`. **Expected:** JSON report; exit 0 means no heuristic hits, exit 1 means hits need review, exit 2 blocks due to invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Post-edit focused verification
**Trigger:** after an idempotency-related edit. **Preconditions:** project test/build command is known. **Action:** run focused duplicate/retry tests, then repository build/static checks. **Expected:** tests demonstrate one intended effect per logical operation and build succeeds. **Failure:** preserve output; diagnose before retry; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** fix contract mismatch; never mark pass while validation fails. **Blocking:** yes.
