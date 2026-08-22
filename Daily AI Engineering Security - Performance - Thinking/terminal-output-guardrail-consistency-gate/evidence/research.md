# Research

## Topic
Terminal Output Guardrail Consistency Gate

## Category
Security / Thinking

## Problem
Agent runtimes can apply different output-guardrail and session-persistence semantics across normal completion, max-turn/error-handler completion, streamed completion, and resumed tool/approval paths. A rejected terminal candidate can be persisted, or a valid terminal record can be lost, causing unsafe replay or inconsistent future state.

## Why it matters now
OpenAI Agents SDK issue #4393, opened 2026-08-13, documented different `Runner.run()` and `Runner.run_streamed()` persistence behavior for `max_turns` handler output after guardrail tripwire/exception. Issue #4125, opened 2026-08-02, documented a streamed resumed approval path that could persist a `function_call` without its matching output after an output-guardrail tripwire. Both were fixed upstream, but they demonstrate a recurring class: terminal paths can bypass the common finalization contract.

## Affected users
Agent SDK maintainers, platform builders, teams using sessions, streamed execution, approvals, guardrails, resumable workflows, or persistent memory.

## Current public evidence
### Observed evidence
- OpenAI Agents SDK #4393: max-turns error-handler output had inconsistent guardrail/session behavior between streamed and non-streamed paths. https://github.com/openai/openai-agents-python/issues/4393
- OpenAI Agents SDK #4125: streamed resume plus output-guardrail trip could leave an orphaned tool call in session state. https://github.com/openai/openai-agents-python/issues/4125
- Official guardrail docs state output guardrails run on final agent output and tripwires reject that output. https://openai.github.io/openai-agents-python/guardrails/

### Interpretation
Framework fixes address known branches, but applications that wrap SDKs, implement custom runners, or upgrade versions still need an executable parity contract that tests all terminal paths against one persistence policy.

## Existing approaches
Framework unit tests; output guardrails; session APIs; error handlers; ad-hoc integration tests.

## Remaining limitations
Tests often cover one completion path only. Streamed/non-streamed, ordinary final output, error-handler final output, resumed tool state, tripwire, guardrail exception, and successful guardrail paths can diverge. A passing functional test may miss session-history corruption visible only on the next run.

## Root-cause analysis
- Separate terminal branches implement persistence in different order.
- Guardrail outcome and persistence decision are not represented as one explicit state machine.
- Tests assert visible response but not durable session invariants.
- Tool-call/result pairing is not revalidated after terminal-path failure.

## Improvement opportunity
Use a deterministic terminal-finalization contract and parity harness. For each terminal path, record candidate existence, guardrail outcome, expected persistence, actual persistence, and tool-call/result balance; fail closed on a rejected candidate that survives or an orphaned call/result.

## Goal / Metrics
- 100% parity across configured streamed/non-streamed terminal fixtures.
- 0 rejected terminal messages persisted.
- 0 orphaned tool calls/results after finalization.
- Explicit evidence for implemented, measured, and verified states.

## Trigger / Inputs / Outputs
Trigger: framework upgrade, runner/error-handler change, guardrail/session change, or terminal-path bug. Inputs: terminal-event fixtures and persisted session snapshots. Output: machine-readable parity report and blocking exit code.
