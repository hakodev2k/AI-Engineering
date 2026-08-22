# Lifecycle Hooks

## Pre-triage validation
**Trigger:** before telemetry collection.  
**Preconditions:** incident symptom and approximate time are supplied.  
**Action:** confirm timezone/window, affected component, available sources, read-only access, and output location.  
**Command/script:** no mutation command; coordinator records normalized inputs in the report draft.  
**Expected result:** explicit bounded investigation scope.  
**Failure behavior:** missing component/window blocks collection until represented as an open question.  
**Blocking:** yes for missing window; no for optional telemetry sources.

## Pre-handoff redaction
**Trigger:** before evidence is passed to another agent or committed.  
**Preconditions:** raw evidence exists locally and is treated as immutable.  
**Action:** create a separate redacted evidence file.  
**Command/script:** `python3 scripts/redact-evidence.py <raw-evidence> <redacted-evidence>`  
**Expected result:** exit 0 and a distinct redacted file.  
**Failure behavior:** do not hand off or commit raw evidence; preserve the redaction error.  
**Blocking:** yes.

## Final report validation
**Trigger:** after verification and before completion.  
**Preconditions:** JSON report has all workflow stages represented.  
**Action:** validate structural and status invariants.  
**Command/script:** `python3 scripts/validate-report.py <report.json>`  
**Expected result:** prints `valid` and exits 0.  
**Failure behavior:** allow at most two correction cycles for distinct validation errors; then mark blocked.  
**Blocking:** yes.

## Approval boundary
**Trigger:** proposed action matches `approval_required_for` in `config/triage.yaml`.  
**Preconditions:** evidence and recommendation are already recorded.  
**Action:** set status `needs-approval`, state the exact proposed action and risk, and stop execution.  
**Command/script:** none; human approval cannot be synthesized by a script.  
**Expected result:** no production mutation occurs before explicit approval.  
**Failure behavior:** any attempt to bypass approval invalidates completion.  
**Blocking:** yes.
