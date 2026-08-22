# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation.  
**Preconditions:** repository and policy are readable.  
**Action:** run `python scripts/verify_package.py`; validate that `config/redaction-policy.yaml` exists.  
**Expected result:** package structure is complete.  
**Failure behavior:** block execution.  
**Blocking:** yes.

## Post-log-generation scan
**Trigger:** after tests, local reproduction, support-bundle creation, or telemetry changes generate candidate output.  
**Preconditions:** candidate files are local and non-production copies when possible.  
**Action:** `python scripts/pii_log_gate.py --policy config/redaction-policy.yaml --input <files> --report pii-gate-report.json`.  
**Expected result:** exit code 0 and report status `passed`.  
**Failure behavior:** preserve sanitized report and return to investigation/remediation.  
**Blocking:** yes.

## Post-edit test hook
**Trigger:** after remediation code changes.  
**Preconditions:** project test command is known.  
**Action:** run focused logging/security tests, then regenerate representative logs and scan them.  
**Expected result:** tests and scanner pass.  
**Failure behavior:** one retry only for proven transient infrastructure failure; otherwise block.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before completion.  
**Preconditions:** remediation and rescan completed.  
**Action:** Security Verifier inspects policy diff, code diff, scanner report, and tests; run `python scripts/verify_package.py`.  
**Expected result:** `verified` and package verification passes.  
**Failure behavior:** block completion and preserve sanitized evidence.  
**Blocking:** yes.
