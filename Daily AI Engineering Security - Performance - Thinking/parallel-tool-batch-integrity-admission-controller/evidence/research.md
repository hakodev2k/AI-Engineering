# Research

## Topic
Parallel Tool Batch Integrity Admission Controller

## Category
Performance

## Problem
Parallel tool execution can lower latency but can also cross runtime-specific thresholds where results are lost, state handling breaks, or recovery becomes more expensive than the saved time.

## Why it matters now
On 2026-08-23, Hermes Agent issue #93251 reported a reproducible dose-response: batches of 1–3 parallel tool calls returned results reliably, while batches of 4 or more caused every call result to become `Result unavailable`. The reporter noted that prompt guidance did not provide a hard runtime cap, so failed recovery could re-fire another oversized batch. This is a direct performance and reliability problem: completed external work is discarded and then repeated.

## Affected users
Agent-runtime developers; developers using MCP/tool calling; platform teams tuning concurrency; users of coding/research agents with many independent I/O tools.

## Current public evidence
### Observed evidence
1. NousResearch/hermes-agent issue #93251 (opened 2026-08-23) reports reliable delivery for parallel batches of 1–3 and total result loss for batches >=4 across repeated turns, sessions, models, and provider swaps. The requested fix is a hard configurable `max_parallel_tool_calls`, because prompt guidance alone cannot enforce delivery safety.
2. WSO2 product-integrator issue #1856 (opened 2026-07-09) documents the opposite baseline problem: sequential execution of independent I/O tool calls makes turn latency approximately additive rather than bounded by the slowest call, motivating true parallel execution.
3. OpenHands software-agent-sdk roadmap #2525 documents why simply switching parallelism on is insufficient: the project staged analysis of tool safety, benchmark infrastructure, implementation/validation, and gradual rollout, with explicit questions about concurrency limits and unknown MCP/custom tools.
4. OpenAI Agents Python issue #3004 documents another parallel-result integrity failure mode: after HITL interruption/resume, a successfully executed tool output could be omitted, causing the API to observe a function call with no corresponding output. Although the root cause differs, it independently shows that execution success and result delivery are separate invariants.

### Interpretation
The reusable engineering problem is not whether parallelism is good or bad. It is that concurrency should be admitted only up to a measured level where every expected result is durably delivered and state semantics remain valid. Latency-only benchmarks can recommend unsafe concurrency.

### Proposed solution
Measure result completeness and latency together. Maintain an expected-result ledger per batch, compute completeness by concurrency, hard-cap admission at the highest level meeting an integrity SLO, and degrade concurrency on incomplete delivery using bounded recovery.

## Existing approaches
Sequential execution; fixed global concurrency; prompt guidance; per-tool parallel-safety metadata; timeouts; framework-specific parallel executors; gradual rollout and benchmarks.

## Remaining limitations
- Prompt instructions do not enforce runtime caps.
- Static limits can become invalid after runtime/provider/tool changes.
- Tool execution success does not prove result delivery into context/state.
- Latency-only tuning can hide dropped results and retry amplification.
- Retrying incomplete mutating batches can duplicate side effects.

## Root-cause analysis
- Execution and result-delivery pipelines have different capacity/state constraints.
- Batch admission is often decided before empirical delivery thresholds are known.
- Result bookkeeping can lose correspondence across parallel calls, interrupts, or transport boundaries.
- Recovery policies may resend full batches instead of only safe missing work.
- Observability usually reports tool duration but not expected-vs-received completeness.

## Improvement opportunity
Make batch integrity a first-class SLO. Require baseline measurement by concurrency, deterministic ledger comparison, hard admission limits, and bounded lower-concurrency fallback. Re-benchmark after runtime/provider/toolchain changes.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/93251
- https://github.com/wso2/product-integrator/issues/1856
- https://github.com/OpenHands/software-agent-sdk/issues/2525
- https://github.com/openai/openai-agents-python/issues/3004
