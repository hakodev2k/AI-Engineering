# Research — Model-Free Wait Broker

## Problem
AI coding agents often re-enter the model merely to poll a still-running process or subagent. These turns consume tokens, credits, latency, and context without adding reasoning value.

## Category
Performance (with Token impact).

## Why it matters now
Recent Codex reports show the problem in current multi-agent and long-running workflows, especially when waits are capped at short intervals.

## Observed public signals
1. OpenAI Codex issue #35259 (2026-07-24) reports repeated model re-entry during wait/status polling. In the reporter's corrected usage window, turns whose only tool action was wait/status polling accounted for 19.8% of raw local token volume.
2. OpenAI Codex issue #31935 (2026-07-09) argues that guidance against waits longer than 60 seconds turns long builds into repeated polling loops with dozens of tool calls that only report "still running".
3. OpenAI Codex issue #18394 (2026-04-17) reports a hardcoded/default 30-second `wait_agent` timeout causing unnecessary polling loops, extra model messages, and avoidable tool turns for long-running subagents.
4. OpenAI Codex issue #33999 (2026-07-18) reports repeated `wait(noop)` calls without a running exec cell, producing tool-call loops and stalled subagents.
5. OpenAI Codex issue #14824 (2026-03-16) associates repeated polling of active exec sessions with long tool-heavy turns that can lose continuity.

## Existing approaches
- Model calls `wait`, `status`, `write_stdin`, or similar tools repeatedly.
- Short fixed wait timeouts keep the UI responsive.
- Parent agents periodically inspect subagent/process state.
- Long-running work may use background execution and explicit polling.

## Observed limitations
- A fixed 30–60 second cadence can convert passive waiting into repeated inference.
- The model is invoked even when state is unchanged.
- Polling creates tool traces/context churn and may amplify quota/credit usage.
- Invalid/no-op wait targets can become repeated loops.
- Increasing the timeout alone does not solve stale/no-op targets or distinguish meaningful state changes.

## Root-cause hypotheses
1. Waiting and reasoning share the same control loop.
2. The runtime lacks a deterministic state-change gate between polling and model re-entry.
3. Poll cadence is time-based rather than event/progress-based.
4. No-op/invalid wait targets are not rejected early.
5. There is no per-task metric for model turns whose only purpose is waiting.

## Improvement target
Introduce a host-side **model-free wait broker** that:
- tracks wait targets deterministically;
- sleeps/polls without LLM inference;
- wakes the model only on completion, failure, cancellation, material progress, user input, or bounded escalation;
- rejects invalid/no-op targets;
- uses adaptive backoff when event subscriptions are unavailable;
- measures avoided model re-entries and wait overhead.

## Success metrics
- `wait_only_model_turns / total_model_turns` reduced toward 0.
- `wait_only_input_tokens / total_input_tokens` reduced by at least 80% from baseline in long-running fixtures.
- No increase in missed completion/failure events.
- Median completion-detection lag within configured SLA.
- Invalid wait targets fail immediately instead of looping.

## Sources
- https://github.com/openai/codex/issues/35259
- https://github.com/openai/codex/issues/31935
- https://github.com/openai/codex/issues/18394
- https://github.com/openai/codex/issues/33999
- https://github.com/openai/codex/issues/14824

## Evidence / interpretation / proposal boundary
The issue reports above are observed evidence. The root-cause grouping is interpretation. The wait-broker design is the proposed engineering solution and is not claimed to be an upstream implementation.