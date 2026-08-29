# Skill: Completion Contract Analysis

## Purpose
Diagnose agent runs that end without a usable external result, without inspecting or requesting hidden chain-of-thought.

## Trigger
Use when users observe silent replies, empty assistant turns, reasoning-only terminal events, repeated continuation after truncation, or automation that reports success without a deliverable.

## Inputs
Provider response metadata; visible text/content; tool/function calls; structured output; explicit no-reply flag; finish/stop reason; retry count; token/latency metrics; runtime logs.

## Preconditions
Traces are sanitized of secrets and do not require private reasoning disclosure.

## Required context
Expected outcome type for the task and protocol/provider semantics for terminal reasons.

## Allowed tools
Trace parsers, local replay fixtures, provider docs, unit/integration tests, observability dashboards.

## Constraints
- MUST NOT require hidden chain-of-thought.
- MUST NOT infer completion merely from `stop`/HTTP 200.
- MUST preserve legitimate tool, structured, and intentional-no-reply outcomes.
- MUST bound automatic recovery.

## Procedure
1. Define allowed observable outcome types for the workload.
2. Capture a baseline sample of terminal turns.
3. Classify each as visible text, tool action, structured result, explicit no-reply, truncation, invalid empty terminal, or nonterminal.
4. Separate provider termination from application completion.
5. Form hypotheses for channel mismatch, adapter mapping, output-budget exhaustion, or placeholder rewriting.
6. Implement a post-response completion predicate.
7. For invalid empty terminals, attempt at most the configured bounded recovery with a concise visible-answer request.
8. Treat truncation as incomplete; continue only if the retry budget and context permit.
9. Emit explicit failure when recovery cannot change the state.
10. Verify on valid non-text outcomes to avoid over-constraining the runtime.

## Decision points
- Text/tool/structured outcome present: complete if task contract allows it.
- Explicit no-reply present and allowed: complete as intentional silence.
- Terminal reason with no allowed outcome: recover, then fail explicitly when budget is exhausted.
- Truncation reason: incomplete, never silently complete.
- Unknown reason/schema: fail closed into an observable adapter error rather than claiming task success.

## Expected output
Facts, response classification, evidence, hypothesis, chosen recovery, retry count, final completion status, and regression metrics.

## Metrics
Invalid-empty-terminal rate; recovery success rate; retries/turn; token/time spent on recovery; valid non-text false-positive rate; explicit-failure coverage.

## Verification
Run the same trace corpus before and after; all previously silent failures must become valid outcomes or explicit failures, while known valid tool/structured/no-reply traces still pass.

## Failure handling
After the retry cap, stop. Preserve sanitized trace evidence and escalate the provider/adapter incompatibility.

## Stop conditions
A run is complete only when an allowed observable outcome exists or an explicit failure/no-reply outcome is recorded according to policy.
