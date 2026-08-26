# Research — Progress-Aware Verification Loop Controller

**Topic:** distinguishing productive verification cycles from stagnant agent loops  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent loop controls can terminate legitimate state-advancing work or trigger redundant verification indefinitely because repeated action shape is treated as equivalent to lack of progress.

## Why it matters now
Recent August 2026 reports show both failure directions: false-positive loop detection that kills unattended work and stale verification state that repeatedly re-runs already-green tests. A separate Codex report shows reviewer findings turning into an unbounded blocking loop.

## Affected users
Developers running coding agents, unattended automation, CI-fix loops, reviewer/implementer multi-agent systems, and platform teams building long-running agent runtimes.

## Current public evidence

### Observed evidence
1. Qwen Code issue #9733, opened August 22, 2026, reports loop detection repeatedly firing on legitimate write/run/edit/re-run verification cycles and terminating unattended turns; the issue describes multiple overnight stalls requiring human nudges: https://github.com/QwenLM/qwen-code/issues/9733
2. Hermes Agent issue #80274, opened August 6, 2026, reports a stale-verification prompt that continued demanding tests after fresh green runs; one session reportedly ran the suite 38 times because the recorded last-verification reference did not advance: https://github.com/NousResearch/hermes-agent/issues/80274
3. OpenAI Codex issue #38375, opened August 13, 2026, reports a multi-agent orchestrator converting out-of-scope reviewer findings into an unbounded blocking loop: https://github.com/openai/codex/issues/38375
4. Qwen Code telemetry documents a `loop_detected` event and tool-call metrics, confirming loop detection is an explicit runtime mechanism rather than only a prompting convention: https://github.com/QwenLM/qwen-code/blob/main/docs/developers/development/telemetry.md

### Interpretation
The common weakness is missing progress semantics. Repetition is not inherently a loop: an edit/test cycle can repeat while repository state changes. Conversely, repeated verification is waste when the state and prior fresh result are unchanged. The control decision therefore needs deterministic state identity and freshness, not only repeated tool-call signatures or textual similarity.

## Existing approaches
- repeated-action/loop detectors
- stale-verification reminders
- hard retry counts
- human interruption/restart
- reviewer agents and repeated test gates
- telemetry on loop detection and tool calls

## Remaining limitations
- repeated command patterns can represent productive progress
- stale verification metadata can drive redundant runs
- terminal task state may be encoded in prose instead of a durable lifecycle
- reviewer loops can expand scope without a bounded convergence criterion
- killing a turn may leave unattended jobs unable to resume safely

## Root-cause analysis
1. No stable task-state identifier is bound to each tool/verification event.
2. Verification freshness is tracked independently from the state it verified.
3. Loop detectors emphasize action similarity rather than state transition.
4. Retry limits are global instead of per-state/per-hypothesis.
5. Stop conditions are not consistently represented as machine-readable lifecycle states.

## Improvement opportunity
Add a progress-aware controller that consumes deterministic state IDs, fresh verification outcomes, terminal task state, and explicit budgets. Treat unchanged-state repetition and repeated verification of the same fresh-green state as stop signals, while allowing repeated action classes when state advances.

## Goal
Reduce false loop terminations and redundant verification without weakening required correctness/security checks.

## Metrics
False loop stops, redundant verifications per state, stagnant repetitions before stop, human reactivation count, successful unattended completion rate.

## Trigger
Any agent workflow with repeated edit/test/review/tool cycles or a loop detector.

## Inputs
Event stream, deterministic state ID, verification freshness/pass status, task lifecycle status, configured budgets.

## Outputs
Machine-readable `continue`, `stop_stagnant`, `stop_redundant_verification`, or `stop_terminal` decision with reason codes.

## Relevant sources
- https://github.com/QwenLM/qwen-code/issues/9733
- https://github.com/NousResearch/hermes-agent/issues/80274
- https://github.com/openai/codex/issues/38375
- https://github.com/QwenLM/qwen-code/blob/main/docs/developers/development/telemetry.md
