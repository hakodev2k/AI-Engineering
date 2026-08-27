# Research — Agent No-Progress Circuit Breaker

**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Runaway or stale-state agent loops that continue consuming model/tool calls after measurable progress has stopped.

## Problem
Long-running coding and tool-using agents can repeatedly continue, re-run verification, retry the same action, or resubmit completed work while making no new progress. Natural-language instructions such as “continue until done” are not a reliable execution bound.

## Why it matters now
Fresh August 2026 reports show multiple implementations exhibiting no-progress continuation or repeated verification, including a Codex runaway continuation loop, a Codex background worker repeatedly resubmitting a completed turn, and Hermes repeatedly re-running already-green verification because a stale receipt never advanced.

## Affected users
Developers running long Codex/Claude/Hermes-style tasks, autonomous coding-agent operators, CI agent builders, and platform teams paying for repeated model/tool calls.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37800, opened 2026-08-10, reports a long-running task repeatedly emitting a continuation status after real work had stopped; the issue is labeled for the core agent loop, model behavior, rate limits and token usage.  
   https://github.com/openai/codex/issues/37800
2. OpenAI Codex issue #40110, opened 2026-08-22, reports an idle background memory worker repeatedly resubmitting a completed turn: 1,911 requests and roughly 243M reported input tokens until the process was manually terminated.  
   https://github.com/openai/codex/issues/40110
3. Hermes Agent issue #80274, opened 2026-08-06, reports a stale verification-status prompt causing the test suite to run 38 times even though verification was green, because the recorded output reference never updated.  
   https://github.com/NousResearch/hermes-agent/issues/80274
4. Qwen Code issue #5734, opened 2026-06-23, describes a detached fork subagent with no turn cap, creating silent unbounded token-burn risk.  
   https://github.com/QwenLM/qwen-code/issues/5734
5. A DeepSeek Harness discussion from August 2026 distinguishes per-step parallelism from an aggregate turn/tool/token circuit breaker and recommends explicit step/token limits.  
   https://github.com/deepseek-ai/deepseek-harness/discussions/3228

### Interpretation
The common engineering defect is observable control-state failure: the runner lacks a hard budget, cannot prove that state changed, or evaluates freshness using a stale verification reference. This is distinct from hidden model reasoning and can be guarded deterministically.

## Existing approaches
- Provider quota/rate limits.
- Per-tool retry limits and command timeouts.
- Manual cancellation.
- Verification commands after each iteration.
- Agent-specific max-turn settings where available.
- Context compaction.

## Remaining limitations
- Provider quotas are a last-resort cost boundary, not task-level progress detection.
- Per-tool retry limits do not stop alternating actions that produce no net progress.
- Verification itself can become the loop if freshness identity is stale.
- Context compaction reduces memory pressure but does not prove forward progress.
- Natural-language completion instructions are not deterministic stop conditions.

## Root-cause analysis
1. No explicit progress event contract.
2. No aggregate step/token budget at the orchestration boundary.
3. Repeated actions are not fingerprinted across turns.
4. Verification receipts are not versioned or bound to the current workspace/input state.
5. Stop conditions are evaluated semantically instead of mechanically.
6. Background workers can outlive the visible task state.

## Improvement opportunity
Add a deterministic pre-next-step circuit breaker using structured events. Track aggregate tokens, step count, consecutive no-progress steps, repeated action fingerprints, and repeated verification receipt IDs. Open the circuit before another model/tool turn when policy thresholds are exceeded. Preserve evidence and require an explicit human or new-task restart rather than silently continuing.

## Goal
Stop measurable no-progress loops before they become large cost/latency incidents while preserving legitimate iterative work.

## Metrics
- Steps per task.
- Input/output tokens per task.
- Maximum consecutive no-progress steps.
- Maximum repeated action fingerprint count.
- Repeated identical verification-receipt count.
- False-positive circuit-open rate.
- Time/tokens saved after a circuit-open event.

## Trigger
Before every autonomous continuation, retry, background follow-up, or verification rerun.

## Inputs
Structured event trace, token usage, action/target/result fingerprint fields, progress flag, verification receipt, policy thresholds.

## Outputs
`continue` or `stop`, machine-readable reason codes, and measured loop metrics.

## Relevant sources
- https://github.com/openai/codex/issues/37800
- https://github.com/openai/codex/issues/40110
- https://github.com/NousResearch/hermes-agent/issues/80274
- https://github.com/QwenLM/qwen-code/issues/5734
- https://github.com/deepseek-ai/deepseek-harness/discussions/3228
