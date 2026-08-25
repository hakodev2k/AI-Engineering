# Research — Terminal Stream Retry Classification Guard

## Topic
Retry classification for terminal/incomplete model-stream states in AI agents.

## Category
Performance

## Problem
Agent runtimes can misclassify terminal model responses or long-lived transport stalls as generic retryable failures. A logically terminal `response.incomplete` can trigger unnecessary request retries and transport fallback, while WebSocket stalls can consume large fixed timeout windows repeatedly before HTTPS fallback. The result is avoidable latency, token/cost amplification, and misleading “still working” behavior.

## Why it matters now
Recent Codex bug reports in August 2026 provide deterministic reproductions and quantified impact. One issue reports `response.incomplete` being treated as retryable stream failure; another reports 300-second WebSocket stalls repeated up to five times before HTTPS fallback. A separate high-severity report describes more than five hours of agent runtime, over 5× baseline, excessive token use, and zero original bugs fixed.

## Affected users
Developers using coding agents, platform builders implementing model streaming/retry logic, teams operating long-running autonomous workflows, and SRE/FinOps owners responsible for latency and token budgets.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38831, opened 2026-08-16: `response.incomplete` is treated as a retryable stream failure, causing unnecessary retries and transport fallback; reporter supplied a deterministic mock-SSE reproduction against the official Rust CLI. https://github.com/openai/codex/issues/38831
2. OpenAI Codex issue #38638, opened 2026-08-14: Responses WebSocket can stall for 300 seconds per retry; HTTPS fallback requires five failed retries, producing a very large latency multiplier. https://github.com/openai/codex/issues/38638
3. OpenAI Codex issue #39512, opened 2026-08-19: a run exceeded five hours (>5× baseline), consumed excessive tokens, and fixed none of the original bugs, illustrating the operational cost of weak progress/retry control. https://github.com/openai/codex/issues/39512

### Interpretation
Retry policy needs semantic state classification, not a single “stream failed” bucket. Terminal application states, transport silence, server errors, rate limits, and explicit user cancellation have different retry eligibility and different safe backoff/fallback behavior.

### Proposed solution
Create a deterministic retry classifier plus measurable workflow: capture baseline latency/retry traces, classify terminal/incomplete/cancelled/transport/server states, cap retries and cumulative wait, perform transport fallback earlier when the evidence supports it, and block regressions when p95 latency or retry count worsens without a corresponding success-rate gain.

## Existing approaches
- SDK/client automatic retries with exponential backoff.
- Fixed WebSocket read/turn timeouts.
- Transport fallback after repeated failures.
- General agent-level retry loops and watchdogs.

## Remaining limitations
- Multiple layers can independently retry the same logical turn.
- A terminal model event can be mistaken for a transport failure.
- Long fixed timeout windows can dominate end-to-end latency before fallback.
- Retry count is often measured without cumulative wait/token amplification.
- Success-rate improvement is not always compared against latency/cost regressions.

## Root-cause analysis
1. Retry policy conflates protocol semantics with transport exceptions.
2. Ownership of retry decisions is distributed across SDK, stream parser, transport and agent loop.
3. Stop conditions are count-based but not always time/budget-based.
4. Fallback is delayed until after a full retry sequence rather than triggered by classified failure evidence.
5. Telemetry lacks a logical-turn identifier spanning attempts and transports.

## Improvement opportunity
Centralize retry eligibility in one deterministic classifier, attach a logical-turn ID, track cumulative wait/attempt/token deltas, impose both attempt and wall-clock budgets, and measure before/after traces.

## Goal
Reduce avoidable retries and tail latency without reducing successful completion rate or weakening correctness.

## Metrics
- attempts per logical turn;
- cumulative retry wait per turn;
- p50/p95/p99 end-to-end latency;
- transport fallback time;
- input/output tokens per successful task;
- successful completion rate;
- terminal-state retry count (target: 0 for non-retryable states).

## Trigger
Any model-stream completion, incomplete terminal event, connection stall, transport error, server error, rate limit, cancellation, or fallback decision.

## Inputs
Normalized event kind, HTTP/status metadata, retry-after value, elapsed attempt time, cumulative attempts/wait, configured budgets.

## Outputs
RETRY/FALLBACK/STOP decision, reason code, bounded delay, updated budget counters.

## Verification
The package is verified only when deterministic tests pass and a before/after trace shows terminal events are not retried, retry budgets are bounded, and latency/retry metrics improve without a success-rate regression.

## Relevant sources
- https://github.com/openai/codex/issues/38831
- https://github.com/openai/codex/issues/38638
- https://github.com/openai/codex/issues/39512
