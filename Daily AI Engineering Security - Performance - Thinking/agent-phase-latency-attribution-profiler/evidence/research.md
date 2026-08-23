# Research — Agent Phase Latency Attribution Profiler

## Topic
Phase-aware latency attribution for agent runs

## Category
Performance

## Problem
End-to-end agent timing can conflate human approval wait, queueing, model inference, retry/backoff, host orchestration, and tool execution. That makes bottleneck diagnosis unreliable and can lead an agent to optimize the wrong subsystem.

## Why it matters now
Current public reports in August 2026 describe multi-minute agent delays where the tool itself executed in seconds, requests for per-tool/phase timing, and simple tasks taking ~15 minutes with no visibility into backend versus model/tool time.

## Affected users
Developers diagnosing slow coding agents; platform teams operating agent runtimes; users with approval-gated workflows; teams benchmarking tools/MCP servers; observability engineers.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #38731, opened 2026-08-15.** A delayed manual approval was interpreted by the agent as a slow network query; the query itself completed in about 11 seconds, but the approval-inflated wall clock drove a false technical conclusion. The report explicitly asks for separate approval-wait and execution-only durations. https://github.com/openai/codex/issues/38731
2. **OpenAI Codex issue #40087, opened 2026-08-22.** A feature request asks for model-vs-tool timing and specifically for separating actual tool execution from Codex overhead/waiting so a 100 ms command is not represented as a 5 second command. https://github.com/openai/codex/issues/40087
3. **OpenAI Codex issue #39190, opened 2026-08-18.** Simple tasks reportedly take around 15 minutes with no visibility into queueing, model reasoning, context work, tool execution, retry/backoff, or final response generation. https://github.com/openai/codex/issues/39190
4. **Anthropic Claude Code issue #86339, opened 2026-08-12.** Nine measured tool-use/result gaps clustered around 305–329 seconds while a recorded command duration was only about 1.4 seconds, demonstrating a large pre-execution wait that a coarse tool envelope would misattribute. https://github.com/anthropics/claude-code/issues/86339

## Interpretation
Independent reports across two agent products show the same observability failure: elapsed time around an action is not equivalent to action execution time. The missing abstraction is a phase-labeled timeline whose semantics are validated before it is used for optimization or agent reasoning.

## Existing approaches
- Per-turn wall-clock timers.
- Tool request/result timestamps.
- Provider/API latency logs.
- Progress messages and UI spinners.
- Generic distributed tracing.

## Remaining limitations
- Lifecycle phases may not be emitted as first-class spans.
- Human approval and queue states are often inside a broader tool/turn interval.
- Overlapping timestamps can double-count time.
- Unattributed gaps disappear into “tool latency” or “agent overhead.”
- A single run is vulnerable to load, cache, approval, and network variance.

## Root-cause analysis
1. Instrumentation boundaries follow API envelopes rather than semantic execution phases.
2. Waiting states are not modeled independently.
3. Agent-visible progress uses wall-clock deltas without provenance.
4. Optimization decisions are made without a validated baseline.
5. Comparisons fail to control workload, cache, model, approval mode, and provider state.

## Improvement opportunity
Adopt explicit phase intervals, validate non-overlap, quantify gaps, and make performance claims only from phase-exclusive measurements across comparable repeated runs.

## Proposed solution
A dependency-free JSONL profiler plus a measurement skill, enforceable rules, independent verifier, post-run hook, and bounded optimization workflow.

## Goal
Prevent false latency diagnoses and make the dominant measurable phase actionable.

## Metrics
Wall time; per-phase duration/share; unattributed gap; p50/p95 per phase across repetitions; tool execution versus approval wait; retry/backoff share; regression rate.

## Trigger
A run exceeds latency SLO, a tool is described as slow, a workflow changes orchestration/approval/retry behavior, or a performance optimization is proposed.

## Inputs
Phase interval JSONL and comparable workload metadata.

## Outputs
Validated phase breakdown, gaps, dominant phase, named slow intervals, evidence suitable for before/after comparison.

## Verification
Overlapping intervals must fail; gaps must be visible; known fixtures must attribute approval wait and tool execution separately; claimed optimization must reduce the targeted phase on repeated comparable runs without weakening security or correctness.