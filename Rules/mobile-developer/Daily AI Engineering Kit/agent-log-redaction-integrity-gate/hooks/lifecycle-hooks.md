# Lifecycle Hooks

## Pre-task scan
**Trigger:** before redaction review. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-logging-risks.py <repo> --output scan.json`. **Expected:** JSON report; exit 0 no heuristic hits, exit 1 findings require review, exit 2 blocks due to invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Post-edit fixture verification
**Trigger:** after logging/redaction edits. **Preconditions:** synthetic fixture tests and project test command are known. **Action:** run focused redaction tests, then repository build/static checks. **Expected:** sensitive sentinels absent, correlation identifiers retained, build succeeds. **Failure:** preserve sanitized output; diagnose before rerun; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** fix contract mismatch; never mark pass while validation fails. **Blocking:** yes.
