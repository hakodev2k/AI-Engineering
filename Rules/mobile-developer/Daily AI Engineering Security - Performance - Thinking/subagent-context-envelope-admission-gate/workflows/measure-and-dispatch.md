# Workflow: Measure and Dispatch

## Trigger
A coordinator is about to dispatch a subagent or materially changes its model/context/tool envelope.

## Goal
Admit only subagent requests with measurable context headroom on the actual execution model.

## Inputs
Task contract, selected model, model limit, token-component measurements, optional-segment inventory, and context policy.

## Baseline
Record the unoptimized total input tokens, fixed overhead, required-context total, selected-model context limit, output reserve, and expected headroom.

## Context
Do not use hidden reasoning. Maintain observable Facts, Assumptions, Measurements, Decision, Risks, and Verification status.

## Stages
1. **Observe** — inventory every context component and identify the actual execution model.
2. **Measure baseline** — count tokens and run `scripts/context_fit_gate.py`.
3. **Diagnose** — if blocked, determine whether overflow is fixed/required, optional, or caused by an incorrect model limit.
4. **Form hypothesis** — choose one remediation: deduplicate optional history, defer optional tool schemas, remove optional payload, or reroute to an approved model.
5. **Implement improvement** — apply only the chosen remediation.
6. **Measure again** — rerun the gate with fresh measurements.
7. **Independent verification** — Context Budget Auditor verifies arithmetic and required-context preservation.
8. **Dispatch** — dispatch only after `allow` and verifier pass.

## Responsible agent
Context analyst owns measurement/remediation. Context Budget Auditor independently verifies. Coordinator performs the final dispatch.

## Tools
Tokenizer/counting utility, model metadata source, `scripts/context_fit_gate.py`, and repository/config readers.

## Outputs
Baseline record, admission JSON, remediation record when applicable, verification record, and final dispatch/block status.

## Checkpoints
- C1: selected execution model and context limit proven.
- C2: complete baseline envelope measured.
- C3: required/optional classification reviewed.
- C4: post-remediation envelope measured.
- C5: independent verifier passed.

## Metrics
Input tokens, effective budget, utilization, headroom/deficit, optional tokens removed, reroute count, pre-dispatch blocks, post-admission overflow failures.

## Retry policy
At most two remediation cycles. Each retry MUST change the measurable envelope or execution model.

## Stop conditions
Stop with success when admission is `allow` and independent verification passes. Stop with failure when required context cannot fit, model limit remains unknown, two remediation cycles fail, or only unsafe context removal would make it fit.

## Failure path
Preserve measurements, identify the blocking component, return a deterministic error, and escalate model/context design to a human or orchestrator. Do not retry unchanged requests.

## Verification
Run unit tests plus at least one real representative envelope before enabling the hook in blocking mode.

## Definition of Done
Evidence documented; baseline captured; actual model limit used; improvement measured when needed; required context retained; tests pass; independent verification passes; and no admitted fixture exceeds effective budget.
