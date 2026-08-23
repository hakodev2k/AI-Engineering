# Research — Agent Tool-Call Burst Budget

## Topic
Agent Tool-Call Burst Budget

## Category
Performance

## Problem
Tool-using agents can issue large bursts of different tool calls within one turn. Existing identical-call loop detectors do not catch this because every call can be unique, while blunt total-step limits react only after cost and latency have already accumulated.

## Why it matters now
Agent runtimes are becoming more autonomous and tool-rich. Current public reports show that rapid tool-call bursts can consume tens of thousands of input tokens before a user receives any result, while long-running command polling can also generate repeated low-value calls.

## Affected users
Developers running coding agents, multi-agent orchestrators, AI support/workflow platforms, and teams paying per token or per external-tool/API call.

## Current public evidence
### Observed evidence
1. OpenClaw issue #47175 (2026-03-15) describes 12+ consecutive tool calls in about 30 seconds and 26 API calls in one turn, with roughly 54k input tokens per call. Its existing loop detection caught repeated identical calls but not bursts of different calls: https://github.com/openclaw/openclaw/issues/47175
2. OpenAI Codex issue #31935 (2026-07-09) reports that a 60-second blocking-wait guidance turns long builds into repeated polling loops that generate dozens of tool calls with little new information: https://github.com/openai/codex/issues/31935
3. Vercel AI issue #17606 (2026-07-21) argues that step-count limits are too blunt and that stuck runs can burn their whole budget before stopping: https://github.com/vercel/ai/issues/17606

### Interpretation
There is a distinct runtime-control gap between duplicate-loop detection and a coarse global turn cap: agents need a per-window budget for tool calls, cost, and low-information polling, with explicit exemptions for productive parallel fan-out and long-running operations.

## Existing approaches
- Total step/turn limits.
- Identical-call loop detection.
- Provider rate limits.
- Manual tool allowlists.
- Ad-hoc polling delays.

## Remaining limitations
- Unique calls evade duplicate detectors.
- Provider rate limits protect infrastructure, not task efficiency.
- Hard low caps can break valid parallel discovery or test fan-out.
- Polling controls are often tied to individual command tools rather than task-level budgets.
- Teams frequently lack a before/after tool-call and token baseline.

## Root-cause analysis
1. No explicit per-turn resource budget across heterogeneous tools.
2. Orchestrators count calls but do not classify informational value or purpose.
3. Polling and retry calls are not separated from progress-producing calls.
4. Budgets are static rather than adjusted for task class and approved fan-out.
5. Completion gates rarely require evidence that optimization reduced calls without lowering task quality.

## Improvement opportunity
Implement a deterministic burst-budget gate that tracks calls in a sliding window, retry/polling classifications, estimated input tokens, and approved fan-out. The gate should return `allow`, `defer`, or `block`, preserve a separate hard global turn limit, and emit machine-readable evidence for regression checks.

## Goal
Reduce unnecessary tool/model calls during bursty runs without blocking valid high-value parallel work.

## Metrics
- Tool calls per turn and per minute.
- Low-information poll/retry share.
- Input tokens per completed task.
- Time to first useful result.
- External API calls per task.
- False-positive budget blocks on productive fixtures.

## Trigger
Before each tool invocation and after every completed tool call.

## Inputs
Tool name, call class, timestamp, estimated input tokens, retry/poll flag, task class, approved fan-out metadata, previous outcomes.

## Outputs
Budget decision, reason, current counters, remaining allowance, recommended recovery action, and audit evidence.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/47175
- https://github.com/openai/codex/issues/31935
- https://github.com/vercel/ai/issues/17606
