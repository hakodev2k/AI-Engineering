# Skill: Loop Failure Analysis
## Purpose
Diagnose agent loops using observable evidence without requesting hidden chain-of-thought.
## Trigger
Repeated tool calls, repeated approvals, stalled completion, unexpected token growth, or framework max-turn exceptions.
## Inputs
Normalized step trace, task goal, configured budgets, completion predicate, tool/approval topology.
## Preconditions
Trace includes step identity, action signature, token counts, and a deterministic progress signal.
## Required context
Task acceptance criteria and orchestration topology only.
## Allowed tools
Trace analyzer, logs, test runner, framework configuration inspection.
## Constraints
MUST NOT infer success from continued activity. MUST NOT increase limits before identifying a concrete reason the existing budget is insufficient.
## Procedure
1. Establish baseline successful-task iteration/token distribution.
2. Identify repeated normalized signatures.
3. Separate Facts, Assumptions, Hypotheses, and Evidence.
4. Check whether progress changes after each repeated action.
5. Map nested loop ownership and all existing termination conditions.
6. Form one hypothesis for the stall and test it within two revisions.
7. Apply a bounded fix and re-run benchmark traces.
## Decision points
Stop immediately on hard budget breach or repeated no-progress signature. Escalate if valid tasks require a larger budget and evidence supports it.
## Expected output
Facts; Evidence; Hypotheses; Decision; Risks; Verification status.
## Metrics
Tokens/task, iterations/task, tool calls/task, repeated-signature count, valid completion rate, early-stop precision.
## Verification
Independent verifier compares before/after traces and confirms no infinite/unbounded path remains.
## Failure handling
Preserve trace, report explicit stop reason, and return partial task state without claiming completion.
## Stop conditions
Hard limits, three repeated no-progress signatures by default, or two failed hypothesis revisions.