# Workflow: Measure and Diagnose Budget Exhaustion

## Trigger
A subagent terminates on usage/spend/iteration limits, returns no useful output, or repeats expensive discovery after resume.

## Goal
Measure where budget is consumed and determine whether pre-call admission, checkpoint reserve, or recovery state is missing.

## Inputs
Usage records, task budget, model/tool call trace, checkpoint artifacts, parent/subagent status transitions.

## Baseline
Capture total tokens/task, tokens before last useful checkpoint, final call estimate, repeated post-resume tokens, tool-call count, and useful output returned.

## Context
Use durable run state and provider/runtime usage signals. Treat uncertain cost telemetry as an explicit uncertainty, not zero cost.

## Stages
1. Observe the cutoff and classify its terminal status.
2. Measure token/call distribution and identify the last durable checkpoint.
3. Diagnose whether the next request was admitted despite insufficient checkpoint reserve.
4. Form a hypothesis for the loss/re-spend path.
5. Apply the guard with recorded usage values.
6. Re-run a controlled fixture and compare before/after.
7. If no improvement, revise the hypothesis at most twice.

## Responsible agent
Performance/token investigator; Budget and Recovery Verifier performs independent review.

## Tools
Usage logs, token estimator, guard script, checkpoint storage inspection.

## Outputs
Baseline, root cause, proposed control point, measured post-change result.

## Checkpoints
After baseline; before provider-dispatch changes; after simulated exhaustion.

## Metrics
Tokens lost at cutoff, repeated tokens after resume, useful-output rate, checkpoint coverage, recovery latency.

## Retry policy
Maximum two diagnosis revisions.

## Stop conditions
Measured improvement verified, accounting is unreliable enough to block safe admission, or retries exhausted.

## Failure path
Stop new fan-out, preserve current checkpoint, and escalate rather than consuming another full budget.

## Verification
Independent verifier reproduces the exhaustion scenario.

## Definition of Done
Baseline and root cause documented; reserve gate implemented; before/after token/recovery evidence captured; no unbounded retries.
