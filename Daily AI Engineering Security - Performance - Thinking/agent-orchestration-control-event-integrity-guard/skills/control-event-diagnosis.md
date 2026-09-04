# Skill — Control-Event Diagnosis

## Purpose
Diagnose agent failures caused by incorrect provenance, causal binding, lifecycle state, or routing of orchestration/control events without requesting hidden chain-of-thought.

## Trigger
Use when a model loses completed subagent results, repeats delegation, loops on wait/status, treats synthetic UI content as user intent, or selects a tool class incompatible with the control intent.

## Inputs
Ordered control-event stream, transcript role/provenance metadata, active run/subagent registry, tool capability map, lifecycle state, and runtime/UI version.

## Preconditions
Events must be timestamped or ordered. The investigator must distinguish user-authored content from runtime-generated content wherever the host provides that information.

## Required context
Current user goal; active causal run IDs; expected lifecycle transitions; available tool classes; known synthetic/meta event types.

## Allowed tools
Trace inspection, repository search, deterministic validator, test fixtures, issue/advisory lookup, local reproduction.

## Constraints
- MUST NOT ask for or expose hidden chain-of-thought.
- MUST derive conclusions from observable events and state.
- MUST NOT silently convert synthetic control text into user intent.
- MUST preserve user-authored instructions exactly when reconstructing provenance.

## Procedure
1. Capture the smallest failing event window: last valid user turn, initiating tool/subagent event, relevant control events, model re-entry, and resulting action.
2. Build a facts table: event ID, source role, synthetic flag, causal ID, lifecycle state, result reference, requested intent, selected routing class.
3. List assumptions separately. Mark unknown provenance/state as unknown rather than inferring it.
4. Run each normalized event through `scripts/control_event_guard.py` using the known causal registry and prior state.
5. Form competing hypotheses: provenance corruption; causal target mismatch; terminal-state regression; missing result reference; incompatible routing class; UI-only message flattening.
6. Select the hypothesis with direct evidence and specify a falsifying test.
7. Fix the host representation/routing policy, not the model's hidden reasoning.
8. Replay the same event fixture and an adjacent valid fixture.
9. If no improvement, allow at most two repair iterations; update the hypothesis from observed evidence.
10. Hand the before/after trace to the independent event verifier.

## Decision points
A synthetic event with user provenance, a completion without a result reference, an event bound to an unknown causal target, a terminal-state regression, or a status/wait intent routed to shell MUST block model re-entry until repaired or quarantined.

## Expected output
Facts, assumptions, evidence, hypotheses, selected decision, risks, before/after metrics, verification status.

## Metrics
Invalid events, wrong-route events, lost results, duplicate delegation after completion, loop length, event-repair count, verification coverage.

## Verification
The original failing fixture must be blocked or corrected deterministically while valid fixtures still pass. Independent review must verify the result.

## Failure handling
Detection: guard finding, irreconcilable provenance, missing causal state, or replay mismatch. Retry: maximum two repair iterations. Fallback: stop auto-continuation and require a fresh explicit user/runtime transition. Escalation: orchestration/runtime owner.

## Stop conditions
Stop on unresolved provenance, unknown causal target, repeated failure after two repairs, or any attempted consequential action based on synthetic/unverified user intent.
