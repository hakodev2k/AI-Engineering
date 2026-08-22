# Lifecycle Hooks

## Pre-task security scan
**Trigger:** before webhook security analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-webhook-security.py <repo> --output scan.json`. **Expected:** JSON report; exit 0 means no heuristic hits, exit 1 means findings need review, exit 2 blocks due to invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Post-edit negative tests
**Trigger:** after webhook verification/replay edits. **Preconditions:** project test command known. **Action:** run focused tests for invalid signature, stale timestamp, exact replay, duplicate delivery, and rotation overlap, then build/static checks. **Expected:** negative scenarios are rejected without duplicate protected effects and build passes. **Failure:** preserve sanitized evidence; diagnose before rerun; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** fix contract mismatch; never mark pass while validation fails. **Blocking:** yes.
