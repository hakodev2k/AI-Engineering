# Incident Commander Lifecycle Hooks

Hooks are predictable safety and quality gates. They do not replace professional judgment or human approval.

## Hook: before-incident-work
**Trigger:** incident state is created or received.  
**Preconditions:** JSON state file is available when structured state is used.  
**Action:** validate required fields, status/severity values, ownership, timestamps, and task structure.  
**Command:** `python scripts/incident_validator.py <incident.json>`  
**Expected result:** exit code 0 and `VALID`.  
**Failure behavior:** block automated downstream processing until state is fixed; manual response may continue with a clearly marked state-validation gap.

## Hook: after-triage
**Trigger:** initial triage is declared complete.  
**Action:** verify that impact, provisional severity, confirmed facts, key unknowns, active workstreams, commander, and next checkpoint exist.  
**Failure behavior:** return triage to the Incident Commander with missing fields; do not treat investigation lanes as fully coordinated.

## Hook: before-production-mitigation
**Trigger:** a production-changing mitigation is proposed.  
**Action:** require a mitigation record containing expected benefit, blast radius, reversibility, success metric, observation window, rollback criteria, execution owner, and approval requirement. Invoke the Risk and Recovery Reviewer.  
**Failure behavior:** block recommendation-to-execution transition when required information or human approval is absent.

## Hook: after-production-mitigation
**Trigger:** an authorized mitigation finishes or aborts.  
**Action:** capture timestamp, actor, change reference, expected signal, observed signal, and outcome classification. Update the evidence timeline.  
**Failure behavior:** if observation data is unavailable, mark outcome `unverified`; do not declare the mitigation successful.

## Hook: before-status-update
**Trigger:** a stakeholder update is ready.  
**Action:** generate or compare a deterministic status summary where structured state is available: `python scripts/generate_status_summary.py <incident.json>`. Check impact, severity, facts, active work, risks, and next checkpoint against the draft.  
**Failure behavior:** block unsupported causal claims, ETA, or inconsistent scope from publication; route sensitive/public messages for human approval.

## Hook: at-synchronization-checkpoint
**Trigger:** scheduled incident synchronization point.  
**Action:** close stale tasks, merge duplicate investigations, resolve ownership gaps, update severity/impact, record decisions, reprioritize work, and set the next checkpoint if active response continues.  
**Failure behavior:** if essential owners are unavailable, escalate staffing/ownership rather than silently extending critical tasks.

## Hook: after-tool-failure
**Trigger:** a diagnostic or coordination tool fails.  
**Action:** classify as transient, permission, invalid input, dependency outage, or unknown. Retry only when transient and within configured bound; otherwise select an alternate evidence path or record the blind spot.  
**Failure behavior:** never retry indefinitely.

## Hook: before-recovery-declaration
**Trigger:** responders believe user impact is resolved.  
**Action:** require recovery evidence across relevant user-facing and system signals over an observation window. Invoke the Risk and Recovery Reviewer.  
**Failure behavior:** keep incident in `monitoring` or `mitigating` if evidence is incomplete.

## Hook: before-active-closure
**Trigger:** Incident Commander intends to transition out of active response.  
**Action:** validate completion against `../checklists/incident-command-checklist.md`: stable recovery, residual risk ownership, temporary mitigation ownership, follow-up actions, final communication, preserved timeline.  
**Failure behavior:** block closure until material gaps are assigned or explicitly accepted by the accountable human owner.

## Hook: after-incident
**Trigger:** active incident closes.  
**Action:** hand the evidence bundle and follow-up register to the post-incident owner. Capture validated process improvements only after review.  
**Failure behavior:** if handoff is rejected or incomplete, return to transition workflow rather than losing ownership.