# Workflow — Observe, Diagnose, Replay, Verify

## Trigger
Lost subagent/tool result, repeated delegation, wait/status tool-selection loop, synthetic message treated as user intent, interruption/resume confusion, or orchestration UI/runtime change.

## Goal
Restore a causally correct, typed control-event stream and prove the same failure cannot silently recur in the tested path.

## Inputs
Failing trace window, user goal, policy/schema, causal registry, lifecycle state, tool capability map, implementation under test.

## Baseline
Record invalid-event count, wrong-route count, duplicate work, lost-result count, loop length, unsupported completion claims, and recovery/rework time.

## Context
Only observable control facts are used. Hidden chain-of-thought is out of scope. Preserve the distinction between actual user instructions and runtime/UI-generated control messages.

## Stages
1. **Observe** — Capture ordered events from last verified user action through the failure.
2. **Measure baseline** — Normalize each control event and run the guard; record metrics.
3. **Diagnose** — Build Facts / Assumptions / Evidence / Hypotheses. Identify the first violated invariant, not merely the final model behavior.
4. **Form hypothesis** — Choose one root cause: provenance flattening, causal mismatch, lifecycle regression, result-reference loss, or wrong routing class.
5. **Implement improvement** — Repair event encoding/routing/state transition at the host/runtime layer.
6. **Measure again** — Replay the identical fixture plus valid adjacent fixtures.
7. **Improved?** — If not, revise the hypothesis from new evidence. Maximum two repair iterations.
8. **Independent review** — `subagents/independent-event-verifier.md` validates the replay and checks for regressions.
9. **Complete** — Only when verified metrics and invariants pass.

## Responsible agent
Orchestration investigator for stages 1–4; runtime implementer for stage 5; independent verifier for stages 6–9.

## Tools
Trace/log inspection, `scripts/control_event_guard.py`, unit/integration tests, repository inspection, issue evidence.

## Outputs
Validated trace, before/after metrics, root-cause record, implementation evidence, independent verification status.

## Checkpoints
- true user input provenance identified
- failing causal operation identified
- first invalid transition/routing decision identified
- replay fixture reproducible
- repair does not suppress legitimate control events
- independent review complete

## Metrics
Invalid control events/1,000; wrong-route events; lost results; duplicate delegation after terminal result; loop iterations; unsupported completion claims; rework time.

## Retry policy
At most two repair iterations after the initial implementation attempt. Each retry must have a different evidence-backed hypothesis or changed implementation mechanism.

## Stop conditions
Unknown user/control provenance; missing causal operation; repeated identical failure after two repairs; any consequential action requested by synthetic/unverified intent; independent verifier blocks release.

## Failure path
Stop autonomous continuation, preserve the validated user goal and last known-good lifecycle state, quarantine the malformed control event, require a fresh valid runtime/user transition, and escalate to the orchestration owner.

## Verification
Run `python -m unittest tests/test_control_event_guard.py` and environment-specific trace replay. Verification must show the original bad route/provenance/state transition is blocked while valid status/completion paths continue.

## Definition of Done
Evidence documented; baseline captured; limitations identified; root cause tied to an observable invariant; repair implemented; tests pass; before/after metrics collected; loops bounded; no unsupported user intent/completion claim remains; independent verifier returns Verified; no blocking issue remains.
