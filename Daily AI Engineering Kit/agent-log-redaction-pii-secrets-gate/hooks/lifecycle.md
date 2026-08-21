# Lifecycle Hooks

## Pre-context hook
**Trigger:** before logs/tool output are attached to an AI prompt or agent context.  
**Preconditions:** evidence exists as text; destination is known.  
**Action:** run `python scripts/redact_logs.py --input <raw> --output <sanitized> --policy config/redaction.yaml --report redaction-report.json`.  
**Expected result:** exit `0` and sanitized artifact.  
**Failure behavior:** exit `2` routes to review; any other non-zero result blocks handoff.  
**Blocking:** yes.

## Post-redaction verification hook
**Trigger:** after a sanitized artifact is created for high-risk/production evidence.  
**Preconditions:** first redaction passed.  
**Action:** re-run the same script using the sanitized artifact as input and a separate temporary output.  
**Expected result:** exit `0` with `findings_count: 0`, except documented exact allowlist matches.  
**Failure behavior:** stop and escalate.  
**Blocking:** yes.

## Policy-change hook
**Trigger:** `config/redaction.yaml` changes.  
**Action:** run `python -m unittest tests/test_redact_logs.py` and `python scripts/verify_package.py`; require approval if blocked detectors are removed or allowlists broaden materially.  
**Expected result:** tests pass and approval exists when required.  
**Failure behavior:** reject policy handoff.  
**Blocking:** yes.

## Final-evidence hook
**Trigger:** before an agent reports investigation completion.  
**Action:** confirm referenced evidence path is sanitized/verified and no raw secret value appears in reports.  
**Expected result:** verifier status `verified`.  
**Failure behavior:** report task as incomplete/inconclusive.  
**Blocking:** yes.
