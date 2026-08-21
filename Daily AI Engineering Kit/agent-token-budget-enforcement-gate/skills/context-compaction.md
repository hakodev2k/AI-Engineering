# Context Compaction

## Purpose
Reduce token usage without discarding evidence required for implementation or verification.

## Trigger
Run when the audit returns `warn`, context grows more than `context_growth_ratio`, or duplicate repository excerpts are detected.

## Inputs
Current context inventory, evidence list, recent turns, policy retention settings, unresolved questions.

## Constraints
Preserve facts separately from hypotheses. Preserve exact file paths, commands, failing assertions, approval state, and unresolved risk. Never summarize a secret into retained context.

## Process
1. Inventory context into requirements, repository facts, logs/tests, decisions, hypotheses, and conversational history.
2. Remove exact duplicates and superseded excerpts.
3. Replace long files with path plus only relevant line ranges.
4. Keep the configured recent-turn window.
5. Keep evidence items up to `preserve_evidence_items`, prioritizing reproducible evidence.
6. Convert repeated narrative into compact structured facts.
7. Mark hypotheses explicitly and remove disproven ones.
8. Recalculate usage and run the budget gate.
9. Perform at most two compaction passes.

## Expected output
A compact context packet containing objective, constraints, evidence, decisions, open questions, and current usage.

## Verification
Every retained decision has supporting evidence; required acceptance criteria remain present; no path or command referenced by the active plan is lost.

## Failure handling
If compaction cannot get usage below the block threshold after two passes, stop and request human approval for a larger budget or smaller task scope.
