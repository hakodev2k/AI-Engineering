# Skill: Context Envelope Analysis

## Purpose
Determine whether a subagent can safely fit its complete request envelope into the context window of the model that will actually execute it.

## Trigger
Run before subagent dispatch and after any change to model, tools, attachments, inherited context, retrieval payload, or output reserve.

## Inputs
- Selected subagent model and its verified context limit.
- Token measurements for system instructions, tool schemas, inherited history, attachments, retrieval, user input, and required context.
- Expected output reserve.
- Optional context segments with token sizes.
- `config/context-policy.json`.

## Preconditions
Token counts MUST be measured with the target model tokenizer when available. If exact tokenization is unavailable, use a documented conservative estimate and mark it as estimated.

## Required context
The task objective, correctness-critical instructions, security constraints, acceptance criteria, and model/tool metadata.

## Allowed tools
Tokenizer/counting utilities, repository readers, configuration readers, model metadata lookup, and `scripts/context_fit_gate.py`.

## Constraints
- MUST use the selected subagent model's effective context limit, not the coordinator's limit.
- MUST preserve required correctness and security context.
- MUST NOT hide an overflow by reducing output reserve below policy minimum.
- SHOULD identify duplicate or optional context before considering model rerouting.

## Procedure
1. Record the selected model and evidence for its context limit.
2. Measure each context component independently.
3. Classify every component as required or optional.
4. Calculate effective input budget: `context_limit - output_reserve - minimum_headroom`.
5. Calculate total input envelope and utilization.
6. Run the deterministic admission gate.
7. If allowed, record headroom and dispatch.
8. If optional reduction is requested, remove only explicitly optional segments in policy order and measure again.
9. If the reduced envelope still does not fit, evaluate only approved reroute models and recalculate against their limits.
10. If no safe fit exists, block dispatch and report the exact deficit.

## Decision points
- Unknown target context limit: block when `fail_closed_on_unknown_limit` is true.
- Required-only envelope exceeds effective budget: do not reduce; reroute or block.
- Optional content causes overflow: reduce optional content and remeasure.
- Utilization exceeds the policy ratio despite technically fitting: treat as insufficient headroom and remediate.

## Expected output
A machine-readable decision plus a human-readable record containing model, context limit, component totals, required total, effective budget, utilization, headroom/deficit, remediation, and measurement confidence.

## Metrics
Overflow caught before dispatch, post-admission overflow failures, optional tokens removed, reroute count, and retained-required-context rate.

## Verification
Use adversarial fixtures where fixed overhead alone exceeds the limit, mixed-model fixtures where coordinator and subagent limits differ, and boundary fixtures exactly around reserve/headroom thresholds.

## Failure handling
On invalid or missing measurements, fail closed and collect missing evidence. Maximum two remeasurement attempts are permitted before escalation.

## Stop conditions
Stop when the envelope is admitted with required context intact, safely rerouted, or deterministically blocked with sufficient evidence. Do not retry an unchanged overflowing envelope.
