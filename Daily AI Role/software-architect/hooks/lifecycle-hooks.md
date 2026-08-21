# Lifecycle Hooks

## before-task-start
**Trigger:** architecture request accepted.  
**Preconditions:** objective or request exists.  
**Action:** validate decision owner, scope, urgency, known constraints, and whether dangerous execution is being requested.  
**Expected result:** task status `intake` or `blocked`.  
**Failure:** block if no accountable objective/owner for a consequential decision.  
**Blocking:** yes for major work.

## after-requirement-analysis
**Trigger:** requirement skill completes.  
**Action:** verify requirement IDs, critical NFRs, assumptions, contradictions, and open questions.  
**Expected result:** design-ready or explicit blocker.  
**Failure:** return once for correction; second failure escalates.  
**Blocking:** yes.

## before-specialist-review
**Trigger:** parallel review starts.  
**Action:** freeze shared design baseline/version and provide identical requirement/NFR context.  
**Expected result:** reviewers evaluate the same proposal.  
**Failure:** reviews do not start.  
**Blocking:** yes.

## before-delivery
**Trigger:** design marked ready.  
**Action:** run `python scripts/validate-package.py` for package integrity when editing the role package; run `python scripts/check-decision-record.py <adr>` for ADRs; complete `checklists/final-review.md`.  
**Expected result:** no blocking validation/review failure.  
**Failure:** return to owner; maximum two correction cycles.  
**Blocking:** yes.

## after-failure
**Trigger:** repeated tool/review/verification failure.  
**Action:** capture evidence, attempted actions, retry count, alternative path, and blocker owner.  
**Expected result:** bounded recovery or escalation.  
**Failure:** stop autonomous retry.  
**Blocking:** yes.

## before-production-action
**Trigger:** proposed deployment, destructive migration, failover, security-policy change, secret action, or infrastructure destruction.  
**Action:** require explicit authorized human approval and an execution owner outside this role unless authority is explicitly delegated.  
**Expected result:** approved handoff or stop.  
**Blocking:** always.