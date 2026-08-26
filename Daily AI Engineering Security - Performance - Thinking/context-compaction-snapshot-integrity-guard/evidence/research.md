# Research — Context Compaction Snapshot Integrity Guard

**Topic:** Context Compaction Snapshot Integrity Guard  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent runtimes can trigger compaction from the wrong token quantity: cumulative run usage, stale session totals, or a configured/advertised context capacity that differs from the effective precheck budget. The result is premature compaction, repeated compaction, rejected tool-heavy turns, extra cost/latency, and possible loss of useful task state.

## Why it matters now
Long-running coding and tool-using agents increasingly depend on automatic compaction. Recent August 2026 bug reports show that token accounting itself can become the failure point: an agent may report hundreds of thousands of tokens while the current prompt is much smaller, or advertise a larger context budget than the precheck actually enforces.

## Affected users
Developers using long-lived agents, agent-runtime maintainers, platform teams exposing configurable context limits, and teams running tool-heavy multi-turn workflows.

## Current public evidence

### Observed evidence
1. **OpenClaw issue #118772 — August 3, 2026.** A P0/data-loss report says `sessionEntry.totalTokens` was inflated by cumulative multi-tool-loop usage rather than the actual current prompt size, causing compaction at roughly 4–8% of the configured context window. The report includes an example where `totalTokens` exceeded 330k while the latest call contained a much smaller live input, and proposes persisting a last-call/context-snapshot value instead of cumulative usage.  
   https://github.com/openclaw/openclaw/issues/118772
2. **OpenClaw issue #118678 — August 3, 2026.** A separate report documents a mismatch between per-agent configured/reported context capacity and a lower embedded precheck budget, causing a tool-heavy turn to fail above the hidden effective cap despite status advertising a larger limit.  
   https://github.com/openclaw/openclaw/issues/118678
3. **OpenAI — “From model to agent: Equipping the Responses API with a computer environment.”** OpenAI describes native compaction as a mechanism for preserving important state when long-running agent context fills, including threshold-based server-side compaction. This makes correctness of the threshold input and effective budget a critical runtime invariant.  
   https://openai.com/index/equip-responses-api-computer-environment/
4. **OpenAI — “Unrolling the Codex agent loop.”** OpenAI describes auto-compaction based on token thresholds and notes that compaction replaces the input with a smaller representative state. This supports treating the current request-context size—not cumulative historical billing usage—as the control variable.  
   https://openai.com/index/unrolling-the-codex-agent-loop/

### Interpretation
These reports point to an accounting-contract problem, not merely a “context is too large” problem. Billing usage, cumulative session usage, current prompt size, model context capacity, and runtime reserve are distinct quantities. When they are stored under ambiguous fields or mixed in threshold logic, compaction decisions become unreliable.

### Proposed solution
Introduce a deterministic snapshot-integrity guard that requires each compaction decision to carry: a fresh current-prompt snapshot, effective context capacity, reserve, source timestamp/turn, and a monotonic-but-separate cumulative usage counter. Refuse automatic compaction when the snapshot is stale, impossible, derived from cumulative usage, or inconsistent with the effective budget.

## Existing approaches
- Automatic threshold-based compaction.
- Last-call usage fields and context-token counters.
- User-configurable context limits and reserve tokens.
- Manual compaction or session reset.
- Provider prompt-usage telemetry.

## Remaining limitations
- A field named `totalTokens` may represent cumulative billed usage in one path and live context occupancy in another.
- Provider usage telemetry may report multiple token classes that are not interchangeable with prompt occupancy.
- Configured model capacity can differ from an internal safety/precheck cap.
- Manual compaction is reactive and does not detect bad accounting.
- A successful compaction can hide the underlying accounting defect while losing useful state.

## Root-cause analysis
1. **Semantic aliasing:** cumulative usage and current-context occupancy share one storage field or interface.
2. **Freshness loss:** a session-level cached count outlives the prompt snapshot it was derived from.
3. **Budget split-brain:** UI/status/config uses one context capacity while preflight enforcement uses another.
4. **Missing provenance:** token counters lack source type (`last_call`, `current_prompt`, `cumulative`) and turn identity.
5. **No invariant gate:** compaction proceeds even when snapshot values are physically impossible or inconsistent.

## Improvement opportunity
A reusable pre-compaction gate can make the invariants observable and testable without changing model behavior. It can distinguish current-prompt occupancy from cumulative usage, compute the effective usable budget, reject stale or contradictory snapshots, and emit reason codes for telemetry.

## Goal
Compaction decisions are made only from fresh current-context snapshots and the same effective budget enforced by the runtime.

## Metrics
- False/premature compaction rate.
- Compactions per 100 turns.
- `snapshot_age_turns` at decision time.
- Ratio `current_prompt_tokens / effective_usable_tokens` when compaction fires.
- Mismatch count between configured and enforced context capacity.
- Tokens/task, latency/task, quality-regression rate after compaction.

## Trigger
Before every automatic compaction decision and whenever effective context configuration changes.

## Inputs
Current prompt tokens, cumulative usage tokens, context capacity, reserve tokens, snapshot turn, current turn, counter source, proposed compaction threshold.

## Outputs
Machine-readable `allow_compaction`, `defer`, or `block_accounting_error` decision with invariant violations and measured utilization.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/118772
- https://github.com/openclaw/openclaw/issues/118678
- https://openai.com/index/equip-responses-api-computer-environment/
- https://openai.com/index/unrolling-the-codex-agent-loop/
