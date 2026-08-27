# Workflow: Verify and Close

**Trigger:** implementation appears complete or a reviewer requests verification.  
**Goal:** obtain one fresh state-bound verification result and terminate cleanly.

## Inputs
Task scope, current HEAD, relevant paths, verification command, latest receipt.

## Baseline
Count existing verification runs for the current verification key and record time/tokens spent after the first green run.

## Stages
1. Observe current HEAD and normalized relevant paths.
2. Build verification key.
3. Check latest receipt.
4. If fresh and successful, proceed to independent review without rerunning.
5. If stale, run the verification command once and write a receipt.
6. If failed, diagnose and implement one bounded fix iteration.
7. Re-run once after a fix.
8. Independent reviewer validates freshness and scope.
9. Complete only on reviewer pass.

## Checkpoints
Before verification, after first result, after any fix, before completion.

## Metrics
Runs per verification key; duplicate green reruns; completion latency; tests passed/failed; out-of-scope findings.

## Retry policy
Maximum 2 verification executions for one unchanged key. Maximum 1 fix iteration before escalation.

## Stop conditions
Two green results for same unchanged key; any unresolved test failure after one fix; scope conflict; unreadable repository state.

## Failure path
Emit concrete evidence and hand off to orchestration owner. Do not keep rerunning.

## Verification
Independent Verification Reviewer must pass current receipt.

## Definition of Done
Fresh successful receipt, reviewer pass, no unresolved in-scope failure, and no loop-control violation.
