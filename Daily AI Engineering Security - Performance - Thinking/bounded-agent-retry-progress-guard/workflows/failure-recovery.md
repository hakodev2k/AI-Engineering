# Workflow: Failure Recovery

**Trigger:** `halt_and_escalate` from the retry/progress guard.  
**Goal:** recover safely without re-entering the same non-progress loop.

## Inputs
Last verified checkpoint, guard result, recent trace, failed hypotheses, task acceptance criteria.

## Baseline
The halted state is authoritative; automatic continuation is disabled.

## Stages
1. Preserve the last verified checkpoint and failure evidence.
2. Classify the halt reason: retry exhaustion, repeated action, or no-progress exhaustion.
3. Identify what new evidence or materially different action would be required to resume.
4. Reject recovery plans that only increase limits, repeat the same signature, or weaken verification.
5. Permit at most one controlled resume after explicit operator approval for high-cost/high-risk cases.
6. Re-run the guard from a fresh trace segment while retaining cumulative run counters for audit.
7. Verify acceptance criteria independently.

## Checkpoints
Before resume approval and after first resumed action.

## Metrics
Halt-to-diagnosis time; repeat-halt rate; percentage of resumes with materially different recovery action.

## Retry policy
One controlled resume. No automatic recursive recovery.

## Stop conditions
Same failure signature reappears, no new evidence exists, dangerous action is proposed without approval, or acceptance criteria remain unobservable.

## Failure path
Return a terminal escalation packet; do not restart.

## Verification
Independent Progress Verifier confirms the recovery changed the causal condition rather than merely extending budgets.

## Definition of Done
Either recovery produces verified progress within budget or the run remains safely halted with complete evidence.
