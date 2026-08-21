# Research Evidence

## Topic
Model Turn Polling Suppression

## Category
Performance

## Problem
Long-running multi-agent and background-process workflows can repeatedly invoke the model merely to issue `wait`, `wait_agent`, `list_agents`, or equivalent status calls when no meaningful state changed. The orchestration loop adds model turns, token processing, latency, and tool-result growth while the useful work is idle elsewhere.

## Why it matters now
Recent Codex Desktop reports from July–August 2026 quantify this behavior in current multi-agent builds. The reports are not generic cost complaints: they isolate model turns whose only action is waiting or status polling.

## Affected users
Developers using multi-agent coding, long-running verifier/CI agents, background commands, and platform teams building agent orchestrators.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #35259, opened 2026-07-24 and still open as of 2026-08-20, reports 1,968 wait/status-only model turns accounting for 19.8% of corrected raw local token volume in one measured window. The report excludes copied history and unchanged token snapshots and describes 30–60 second polling cadence.
2. OpenAI Codex issue #37299, opened 2026-08-06 and still open as of 2026-08-20, reports 8,744 of 11,002 model-visible tool calls were wait/status family calls, with 83% of `wait_agent` calls timing out without useful change. It also reports stale `running` subagent state prolonging the loop.

### Interpretation
These are independent user reports in the same official repository. They support a recurring orchestration failure mode: unchanged state can trigger a full model re-entry instead of remaining a cheap scheduler concern. Exact billing effects are deployment-specific, so this package measures local turns/tokens/latency rather than assuming a universal cost model.

## Existing approaches
- Fixed-interval wait/status polling with bounded timeouts.
- Manual backoff or longer waits.
- Async/background agent execution.
- Status/list APIs for child agents.
- Caching and prompt-prefix reuse, which can reduce some compute/cost but does not eliminate unnecessary model turns.

## Remaining limitations
- A timeout/no-change result may still create a model turn.
- Fixed cadence ignores expected job duration and progress rate.
- Stale child state can keep a parent polling indefinitely.
- Diagnostics often mix useful model turns with coordination-only turns.
- Longer polling intervals reduce frequency but can hurt liveness if no event/wakeup path exists.

## Root-cause analysis
1. Scheduler state transitions are mediated by the model rather than a deterministic harness path.
2. No explicit "meaningful state changed" predicate gates model re-entry.
3. No per-task budget for consecutive no-progress polling turns.
4. Polling cadence is not adapted or coalesced across agents.
5. Lifecycle state can remain stale after child completion.
6. Observability does not always attribute tokens/latency to polling-only turns.

## Improvement opportunity
### Proposed solution
Instrument orchestration traces, classify polling-only turns deterministically, establish a baseline, then suppress/coalesce model re-entry when observed child/process state is unchanged. Prefer event-driven wakeups when the host supports them; otherwise use bounded adaptive backoff plus a liveness checkpoint. Never suppress a wakeup carrying new output, completion, error, approval request, or user input.

## Goal
Reduce avoidable coordination model turns and tokens while preserving task success and bounded wakeup latency.

## Metrics
Model turns/task, polling-only turns/task, polling-turn ratio, tokens/task, polling-token ratio, consecutive no-progress polls, p50/p95 task latency, wakeup delay, task success/regression rate.

## Trigger
Run when a workflow uses agents/background jobs with repeated waits, or when polling-only turns exceed the configured budget.

## Inputs
JSONL orchestration trace, task completion result, configured thresholds, optional baseline trace.

## Outputs
Baseline report, regression verdict, diagnosed polling pattern, bounded remediation plan, before/after metrics.

## Relevant sources
- https://github.com/openai/codex/issues/35259
- https://github.com/openai/codex/issues/37299
