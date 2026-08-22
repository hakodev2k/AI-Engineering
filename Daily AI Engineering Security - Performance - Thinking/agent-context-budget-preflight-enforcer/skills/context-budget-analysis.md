# Skill: Context Budget Analysis

## Purpose
Measure a fully assembled agent request before model invocation and decide whether it can be sent without context overflow or unsafe truncation.

## Trigger
Every model call after instructions, tool definitions, history, memory, retrieval and tool outputs have been assembled.

## Inputs
Model context window, reserved output tokens, safety margin, and component records containing `name`, `kind`, `tokens`, `priority`, `critical`, and optionally `reloadable`.

## Preconditions
Token counts come from the host's tokenizer/provider accounting and represent the actual serialized content closely enough for the configured margin.

## Required context
Model identifier/configuration, task requirements, critical security/user constraints, component provenance.

## Allowed tools
Provider tokenizer, host prompt serializer, this package analyzer, regression test suite.

## Constraints
Never remove protected/critical components to save tokens. Never claim optimization without before/after counts. Keep reduction cycles bounded.

## Procedure
1. Compute usable input budget = context window - reserved output - safety margin.
2. Sum all component token counts.
3. If total <= usable budget, allow and record utilization.
4. If over, rank non-critical components by configured reducibility/priority and size.
5. Produce reduction candidates sufficient to cover the deficit without touching protected kinds.
6. Apply one reduction strategy externally (dedupe, retrieve fewer items, compact old tool results/history, reloadable-content eviction).
7. Recount the exact new payload.
8. Repeat at most `max_reduction_cycles`.
9. If still over, block and choose a correctness-preserving fallback.

## Decision points
Unknown model limit => block automatic optimization. Negative token count => invalid. Required context alone exceeds budget => block/split/escalate. Output reserve cannot be sacrificed silently.

## Expected output
Budget report with total input, usable budget, utilization, deficit, protected token total, and safe candidate list.

## Metrics
Input tokens/task, utilization, overflow rate, reduction amount by component, quality regression rate.

## Verification
Replay representative tasks with original vs reduced context and verify outcome/evidence requirements, not only token counts.

## Failure handling
At most two automatic reduction cycles by default. Preserve original payload/evidence for diagnosis.

## Stop conditions
Stop when request fits safely, no safe candidates remain, or additional reduction would remove protected/critical context.