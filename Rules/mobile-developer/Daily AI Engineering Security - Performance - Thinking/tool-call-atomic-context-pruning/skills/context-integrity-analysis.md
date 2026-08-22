# Skill — Context Integrity and Budget Analysis

## Purpose
Reduce agent context safely without breaking tool-call protocol state or silently deleting correctness-critical context.

## Trigger
Context approaches its budget, a memory window is loaded, a session is compacted/resumed, or provider errors indicate malformed tool history.

## Inputs
Ordered messages, model/provider validity constraints, input budget, reserved output tokens, current goal/acceptance criteria, token metadata when available, and representative regression tasks.

## Preconditions
History is available in structured message form with tool-call IDs and tool-result IDs. The analyzer does not need hidden chain-of-thought.

## Required context
Current user goal, protected system/developer constraints, active tool transaction state, provider message rules, and the context budget used by the actual invocation path.

## Allowed tools
Token counters/estimators, message validators, repository inspection, local fixtures, provider documentation, test runners, and `scripts/context_pruner.py`.

## Constraints
Never remove required safety/authorization context merely to meet a token target. Never fabricate missing tool results as a default repair. Never repeatedly submit the same malformed history.

## Procedure
1. Capture baseline: input tokens/estimate, output reserve, tool-call count, current provider errors, latency/cost if available.
2. Validate message history before optimization; list orphan results, unanswered calls, duplicate IDs, and provider-specific ordering violations.
3. Convert history into atomic units. A tool-call request and all matching results form one unit.
4. Classify protected units: system constraints, latest user goal, active acceptance criteria, recent working set, and unresolved tool transaction.
5. Form a budget hypothesis: remove oldest unprotected complete units first; summarize only complete units when summarization is needed.
6. Run deterministic pruning and record retained/dropped units and before/after budget.
7. Validate the output history again before any model call.
8. Run representative task regressions and compare correctness/verification results, not only token savings.
9. If the budget cannot be met safely, return a budget failure and escalate to a larger context/model, retrieval strategy, or explicit checkpoint rather than deleting protected context.
10. Record Implemented, Measured, and Verified separately.

## Decision points
- Invalid input history: fail closed and route to an explicit recovery workflow.
- Budget met with valid history: proceed to regression verification.
- Budget unmet because only protected/recent units remain: stop pruning and escalate.
- Quality regression exceeds accepted threshold: restore context or change selection/summarization strategy.

## Expected output
Validated pruned history; baseline/after metrics; protected/dropped unit inventory; integrity findings; quality regression result; residual risk.

## Metrics
Tokens/task, input-context utilization, units dropped, orphan/unanswered count, provider 4xx rate, cost/task, latency/task, task-quality score, regression rate.

## Verification
A separate verifier checks structural validity and runs the same representative tasks against baseline and pruned contexts.

## Failure handling
Do not retry malformed context unchanged. Preserve the original session state, emit exact structural findings, and choose one of: restore last valid checkpoint, disable the faulty pruning path, or escalate for explicit repair.

## Stop conditions
Maximum two optimization iterations per benchmark cycle. Stop immediately if further reduction requires deleting protected safety/current-goal context or introducing synthetic tool results without reviewed policy.
