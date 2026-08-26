# Workflow: Exhaustion and Resume Verification

## Trigger
Changes to budget admission, checkpoint persistence, terminal-state handling, or resume logic.

## Goal
Prove the agent yields before consuming its checkpoint reserve and resumes from durable partial state without repeating settled work.

## Inputs
Policy, guard script, unit tests, checkpoint store, workspace identity, parent/subagent status events.

## Baseline
Known cases: normal budget, soft pressure, next-call reserve violation, hard pressure, process restart with a valid checkpoint, workspace drift after checkpoint.

## Stages
1. Run `python -m unittest tests/test_budget_checkpoint_guard.py`.
2. Simulate soft pressure and require checkpoint persistence.
3. Simulate a next call that would violate the reserve; verify no provider dispatch occurs.
4. Verify terminal state is `partial_budget_exhausted`, never `completed`.
5. Restart the worker and load the checkpoint before any repository scan/retrieval.
6. Revalidate only mutable external state and continue from `next_step`.
7. Compare repeated tokens/tool calls against the pre-change baseline.

## Responsible agent
Budget and Recovery Verifier.

## Tools
Unit tests, token estimator, run logs, checkpoint storage.

## Outputs
Pass/fail record, before/after repeated-token count, terminal-state evidence, resume evidence.

## Checkpoints
Before exhaustion simulation and after restart/resume.

## Metrics
Checkpoint coverage, repeated tokens after resume, duplicate tool calls after resume, useful-output-before-cutoff rate.

## Retry policy
One corrective change and one full rerun. Resume itself is limited by `max_resume_attempts`.

## Stop conditions
Any provider call that violates reserve, any false `completed` state, missing durable checkpoint, or exhausted retry budget blocks completion.

## Failure path
Preserve checkpoint, stop additional model calls, and escalate the violated invariant.

## Verification
Reviewer must be separate from the implementation agent for high-impact orchestration changes.

## Definition of Done
All tests pass; reserve is enforced pre-call; checkpoint survives restart; resume avoids unnecessary rediscovery; no critical context is dropped.
