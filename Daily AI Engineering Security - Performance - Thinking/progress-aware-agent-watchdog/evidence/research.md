# Research — Progress-Aware Agent Watchdog

## Topic
Progress-Aware Agent Watchdog

## Category
Performance

## Problem
Agent runtimes need watchdogs to detect dead streams and stalled subagents, but fixed inactivity timers can kill healthy long-running work while naive retries restart from scratch and burn large token/time budgets. The hard part is distinguishing “slow but making progress” from “truly stalled,” then recovering without repeating expensive exploration.

## Why it matters now
Fresh July–August 2026 reports across major coding-agent systems show both sides of the failure: watchdogs terminate healthy work, while weak or absent recovery can hang indefinitely. One Claude Code report documented roughly 580k tokens burned across repeated restarts with zero code progress. Another report shows healthy async agents being killed exactly at a configured timeout. Hermes users likewise report false “provider unresponsive” failures for slow reasoning models.

## Affected users
AI coding-agent users, agent-runtime/platform engineers, teams running background/subagents, local-model users, CI automation, and anyone operating long-running autonomous workflows.

## Current public evidence

### Observed evidence
1. **Claude Code #85206 — 2026-08-09.** The Workflow stall watchdog repeatedly killed an actively working subagent and restarted it without transcript carry-over; four attempts consumed about 580k tokens with zero lines of code written: https://github.com/anthropics/claude-code/issues/85206
2. **Claude Code #85265 — 2026-08-09.** A background subagent could be killed at exactly 600 seconds even while work was healthy because the watchdog interpreted the interval before the next stream chunk as a stall: https://github.com/anthropics/claude-code/issues/85265
3. **Claude Code #79017 — 2026-07-19.** A report describes a hard-coded Workflow no-progress kill threshold that ignores configurable timeout variables and cannot reliably distinguish slow-but-alive work from a hung agent: https://github.com/anthropics/claude-code/issues/79017
4. **Claude Code #75036 — 2026-07-06.** A recurring issue describes a no-progress watchdog that detects stalls but lacks a robust recovery path and references prior retry loops that repeat full-token-cost attempts: https://github.com/anthropics/claude-code/issues/75036
5. **Hermes Agent #87292 — 2026-08-15.** Slow local reasoning models were aborted as “provider unresponsive” after stale-attempt thresholds, leaving the session in an error state until the model changed: https://github.com/NousResearch/hermes-agent/issues/87292
6. **OpenAI Codex #32987 — July 2026.** A request emitted zero SSE events for 600 seconds, then an identical retry completed in seconds; the report illustrates the opposite problem—real transport stalls exist and require finite recovery rather than simply disabling watchdogs: https://github.com/openai/codex/issues/32987
7. **AgentTrace and Datadog Trajectory (2026).** Current observability tools explicitly track tokens, latency, failures, retries, loops, stalls, and progress markers, showing a practical move toward behavior-based rather than wall-clock-only diagnosis: https://github.com/luoyuctl/agenttrace and https://github.com/datadog-labs/trajectory

## Existing approaches
- Fixed no-progress or stream-idle timers.
- Timer resets on stream chunks or tool activity.
- Exponential retry after transport failure.
- Maximum retry counts.
- Context-size-aware timeout floors in some runtimes.
- External trace tools that identify stalls after or during runs.
- Manual “continue”/restart or model switching.

## Remaining limitations
- A single timer conflates transport silence, model reasoning latency, tool execution, and actual lack of task progress.
- Tool-call activity is not equivalent to useful progress; a looping agent can remain “busy.”
- Conversely, a model can make real progress internally while producing no stream event for a long period.
- Retrying from scratch discards expensive repository discovery, environment setup, and verified partial results.
- Many retry policies do not compare progress across attempts, so identical failures can repeat until a coarse retry count is exhausted.
- Raising timeouts globally reduces false positives but extends real hangs and increases queue occupancy.

## Root-cause analysis
1. **Liveness is represented by one timestamp.** Runtimes often lack multiple independent progress signals.
2. **No phase awareness.** Clone/install/test/model-think/tool-execution phases have very different healthy latency distributions.
3. **No durable progress checkpoint.** Retry starts from the beginning instead of resuming from verified milestones.
4. **No cross-retry novelty check.** Identical error/progress signatures are retried even when nothing new was achieved.
5. **Budget dimensions are disconnected.** Time, tokens, retries, and useful progress are not evaluated together.

## Improvement opportunity
Introduce a progress-aware watchdog that combines transport heartbeat, tool lifecycle, durable artifact changes, milestone/checkpoint movement, and retry novelty. Use phase-specific patience, preserve resumable checkpoints, and apply a circuit breaker when repeated attempts show no new verified progress. This keeps finite hang protection while avoiding blind restarts.

## Goal
Reduce false-positive kills and repeated full-cost retries without allowing genuine stalls to run indefinitely.

## Metrics
- False-positive watchdog terminations per 100 long-running tasks.
- Median/P95 wasted tokens on failed retries.
- Retry-from-scratch rate.
- Recovery success rate from last verified checkpoint.
- Time-to-detect genuine stall.
- Repeated-identical-signature count.
- Useful-progress-per-1k-tokens and useful-progress-per-minute.
- Maximum retries: bounded by policy (default 3 total attempts).

## Trigger
Long-running model requests, background/subagent execution, no-stream intervals, repeated tool loops, or retries after watchdog/transport failure.

## Inputs
Current phase, last transport event time, last tool completion time, durable progress marker, artifact/checkpoint hash, retry signature, attempt number, token usage, elapsed time, and policy.

## Outputs
Continue/wait, checkpoint-and-retry, resume, switch recovery strategy, or stop/escalate decision; next patience window; findings; and audit metrics.

## Interpretation
The evidence does not mean watchdogs should be disabled. Real silent stream failures also occur. The recurring weakness is using fixed wall-clock inactivity as the primary liveness signal and restarting expensive work without checking whether the new attempt differs from the failed one.

## Proposed solution
A reusable multi-signal watchdog plus deterministic liveness scoring/circuit breaker, phase-aware rules, resumable checkpoints, bounded retry workflow, and tests for healthy-slow, true-stall, active-tool, and repeated-no-progress cases.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85206
- https://github.com/anthropics/claude-code/issues/85265
- https://github.com/anthropics/claude-code/issues/79017
- https://github.com/anthropics/claude-code/issues/75036
- https://github.com/NousResearch/hermes-agent/issues/87292
- https://github.com/openai/codex/issues/32987
- https://github.com/luoyuctl/agenttrace
- https://github.com/datadog-labs/trajectory