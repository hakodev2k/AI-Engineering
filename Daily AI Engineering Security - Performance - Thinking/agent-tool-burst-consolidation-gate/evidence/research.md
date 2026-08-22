# Research

## Topic
Agent Tool-Burst Consolidation Gate

## Category
Performance

## Problem
Heterogeneous rapid-fire tool sequences can consume many model round trips, tokens, and seconds without triggering identical-call loop detection or producing a useful user-visible checkpoint.

## Why it matters now
### Observed evidence
- OpenClaw issue #47175, opened **2026-03-15**, reports 12+ consecutive tool calls in ~30 seconds and 26 API calls in one session turn while troubleshooting. The reporter notes existing loop detection catches repeated identical calls but not bursts of different calls. https://github.com/openclaw/openclaw/issues/47175
- Hermes Agent issue #48195, opened **2026-06-18**, reports multi-step tasks being split into excessive individual tool calls, with each split causing another full API round trip, additional context, and token spend. Prompt rules and live corrections were described as insufficient; a runtime interceptor/consolidation checkpoint was proposed. https://github.com/NousResearch/hermes-agent/issues/48195
- OpenClaw issue #24800 documents long consecutive tool-use loops growing context until overflow, reinforcing that tool-heavy single turns can bypass ordinary user-turn maintenance points. https://github.com/openclaw/openclaw/issues/24800

### Interpretation
Identical-loop detection and hard max-turn limits solve different problems. A burst budget should detect cost/latency amplification across non-identical calls and request a bounded planning/checkpoint step, not blindly abort all multi-step workflows.

## Affected users
Coding agents, research agents, support/operations agents, subagent-heavy workflows, API users billed per token/model call.

## Existing approaches
- Hard step/turn caps.
- Identical-call loop detection.
- Prompt rules asking the model to batch work.
- Manual cancellation.
- Tool-specific disabling.

## Remaining limitations
Hard caps cannot distinguish productive chains from thrashing. Identical-loop detection misses heterogeneous calls. Prompt guidance is non-deterministic. Very low caps can interrupt legitimate build/test/research work.

## Root-cause analysis
1. Tool-loop control observes call identity but not burst-level cost.
2. Each tool call may trigger a full model round trip with large repeated context.
3. Error recovery encourages local reactive calls without a consolidation checkpoint.
4. Runtime lacks measurable stop criteria tied to calls, tokens, elapsed time, and repeated target locality.

## Improvement opportunity
Introduce a deterministic post-tool budget evaluator that can require a checkpoint when any bounded budget is exceeded, then reset only after a user-visible or structured consolidation step.

## Goal
Reduce wasted calls/tokens/latency during thrashing while preserving legitimate multi-step completion.

## Metrics
Calls/turn, input tokens/task, p95 turn latency, task completion rate, checkpoint rate, quality regression rate.

## Trigger / Inputs / Outputs
Trigger: after each tool result. Inputs: tool, target/domain, prompt tokens, elapsed milliseconds, success/failure, checkpoint state. Output: continue or checkpoint-required with reason and accumulated metrics.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/47175
- https://github.com/NousResearch/hermes-agent/issues/48195
- https://github.com/openclaw/openclaw/issues/24800
