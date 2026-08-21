# Final Verification Hook

**Trigger:** after implementation and tests, before declaring success.

**Preconditions:** implementation diff and test output exist; no approval-required production operation has been executed.

**Action:** Verification Agent runs relevant project build/tests, inspects the diff, reruns `python scripts/scan_queue_handlers.py <target-root> --output queue-gate-findings.json`, and validates this kit with `python scripts/verify_package.py <kit-root>`.

**Expected result:** package verifier passes; project checks pass; any scanner findings are resolved or explicitly justified with evidence; Definition of Done is evidenced.

**Failure behavior:** deterministic failure blocks completion. A transient tool/environment failure may be retried once, preserving both outputs.

**Blocking:** yes.