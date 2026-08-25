# Research

## Topic
Agent SDK control-stream lifecycle integrity

## Category
Performance

## Problem
A long-lived agent host often multiplexes model input, permission callbacks, MCP tool results and subagent control over a child process/stdin channel. Closing that channel based on prompt-iterator completion or an early top-level result can strand still-active tool/subagent work. The observable outcome is `Stream closed`, retries, stalls and incomplete multi-step turns.

## Why it matters now
Several 2026 issues against the Claude Agent SDK independently reproduce the same family of lifecycle failures under streaming input, multi-tool turns, Windows timing and background subagents.

## Affected users
Agent SDK integrators, desktop/IDE hosts, multi-agent orchestrators, MCP tool developers and teams running long multi-tool workloads.

## Current public evidence

### Observed evidence
1. Issue #348 (2026-06-12) reports streaming input closing CLI stdin while in-process MCP calls still need the bidirectional control channel, causing later calls to fail with `Stream closed`. https://github.com/anthropics/claude-agent-sdk-typescript/issues/348
2. Issue #359 (2026-06-30) reports intermittent Windows failures after the first tool call that disappear with `debug: true`, consistent with a timing/buffering race rather than a tool-specific failure. https://github.com/anthropics/claude-agent-sdk-typescript/issues/359
3. Issue #376 (2026-07-14) reports stdin closing after a top-level result while a background subagent is still running and later needs `canUseTool`, permanently breaking further gated tool calls for that process. https://github.com/anthropics/claude-agent-sdk-typescript/issues/376
4. Issue #385 (2026-07-20) reports `shouldQuery:false` causing the canUseTool stdin channel to close mid-turn, deterministically failing subsequent tool calls. https://github.com/anthropics/claude-agent-sdk-typescript/issues/385

### Interpretation
The common engineering weakness is lifecycle coupling to an insufficient proxy signal (input exhausted, first result seen, or query state) rather than the set of outstanding operations that actually depend on the control transport. Debug mode changing behavior further indicates that timing-sensitive validation is required.

## Existing approaches
- Avoid streaming input or particular prompt shapes.
- Enable debug as a diagnostic workaround.
- Restart/retry failed sessions.
- Serialize or simplify tool activity.
- SDK-level bug fixes as individual close-paths are identified.

## Remaining limitations
- Workarounds reduce features or add latency and do not prove the lifecycle invariant.
- Blind retries can duplicate state-changing tools and amplify latency/cost.
- A fix for one close trigger may leave another path (background worker, permission callback, cancellation) unfenced.
- Logging can perturb timing, making a race disappear.

## Root-cause analysis
1. Transport ownership is not explicitly tied to all dependents.
2. Prompt/input lifecycle is conflated with turn/control lifecycle.
3. Background worker settlement is not always joined before transport teardown.
4. No deterministic invariant check flags a close attempted with active dependents.
5. Recovery often retries at a higher layer without first reconciling side effects.

## Improvement opportunity
Instrument a provider-neutral lifecycle trace and enforce a close barrier derived from active turns, outstanding control requests and background workers. Measure baseline failures and latency first; after implementation, benchmark again and reject any change that merely trades correctness for indefinite wait.

## Relevant sources
- https://github.com/anthropics/claude-agent-sdk-typescript/issues/348
- https://github.com/anthropics/claude-agent-sdk-typescript/issues/359
- https://github.com/anthropics/claude-agent-sdk-typescript/issues/376
- https://github.com/anthropics/claude-agent-sdk-typescript/issues/385
