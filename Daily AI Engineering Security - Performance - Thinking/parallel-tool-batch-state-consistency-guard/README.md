# Parallel Tool Batch State Consistency Guard

**Category:** Performance  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Parallel tool execution can improve latency, but recent agent-framework bugs show that sibling calls, approval queues, handoffs, and shared session state can become inconsistent when several calls execute at once. The result is often worse performance and lower reliability: lost calls, duplicate retries, loops, stale-agent replies, or interleaved memory.

## Evidence
See `evidence/research.md`. Current evidence includes Microsoft Agent Framework, Google ADK Go, LiveKit Agents, and AgentScope Runtime reports plus Microsoft's current approval/session guidance.

## Existing approach
Frameworks typically provide concurrent execution, session-scoped state, approval middleware, selected locks, and retry/re-prompt behavior.

## Existing limitations
Those mechanisms do not automatically provide a transactional contract for an entire model-issued tool batch. Session recreation, shared mutable fields, handoff/reply races, and retrying side effects can still violate sibling-call identity or terminal-state guarantees.

## Proposed improvement
Introduce a batch consistency contract around parallel execution:
- durable `batch_id` and `tool_call_id`
- session-version snapshot for stateful commits
- explicit terminal state for every issued call
- selective serialization/barriers only for conflicting state
- idempotency requirement for automatic side-effect retries
- deterministic trace replay and invariant checking in CI

## Architecture
`skills/batch-state-diagnosis.md` defines the investigation procedure. `rules/parallel-batch-invariants.md` is the enforceable contract. `hooks/pre-batch-dispatch.md` prevents unsafe dispatch. `schemas/tool-batch-event.schema.json` standardizes observability. `scripts/batch_trace_analyzer.py` checks trace invariants. `tests/test_batch_trace_analyzer.py` verifies the analyzer. The independent verifier reviews correctness and measured performance after the bounded workflow.

## Package tree
```text
README.md
evidence/research.md
skills/batch-state-diagnosis.md
rules/parallel-batch-invariants.md
subagents/batch-consistency-verifier.md
workflows/measure-fix-replay.md
hooks/pre-batch-dispatch.md
scripts/batch_trace_analyzer.py
tests/test_batch_trace_analyzer.py
schemas/tool-batch-event.schema.json
```

## Installation
Requires Python 3.10+; the included analyzer uses only the standard library. Add structured tool lifecycle events to the host orchestrator and emit JSONL matching the schema fields used by the analyzer.

## Configuration
At minimum emit `batch_id`, `event`, `timestamp`, and `tool_call_id` for call events. Add `session_id`, `session_version`, `idempotency_key`, and `state_scope` when available. A `batch_created` event must enumerate `tool_call_ids` before execution starts.

## Usage
Validate a captured trace:

```bash
python3 scripts/batch_trace_analyzer.py trace.jsonl
```

Run analyzer tests:

```bash
python3 -m unittest tests/test_batch_trace_analyzer.py
```

Exit code 0 means structural batch invariants pass, 2 means the input could not be parsed, and 3 means an invariant violation was found.

## Workflow
Follow `workflows/measure-fix-replay.md`: Observe → measure sequential and current-parallel baselines → diagnose → form one hypothesis → implement the smallest consistency boundary → measure again → retry at most once → independent verification.

## Metrics
Measure p50/p95 batch latency, throughput, lost-call rate, duplicate starts, non-terminal calls, state-version conflicts, approval continuation success, and retry count. A concurrency fix is not successful merely because correctness improves; report the latency/throughput cost relative to both baselines.

## Verification
1. Use the same fixtures for sequential and parallel baselines.
2. Capture at least one previously failing trace.
3. Run the analyzer after the change.
4. Run integration tests for approvals, handoffs, and side effects applicable to the host.
5. Verify automatic retries have stable idempotency keys.
6. Have `subagents/batch-consistency-verifier.md` independently return PASS.

## Safety
Never fabricate a tool result to keep the model moving. Never automatically retry a destructive or externally visible side effect without idempotency evidence. Do not globally disable approval or state-version checks for performance.

## Failure handling
Detection comes from trace invariants, tests, or benchmark regressions. Preserve sanitized evidence. Retry a remediation at most twice total. If the framework cannot provide stable call correlation, stop and add observability first. If only one state scope is unsafe in parallel, serialize that scope while preserving independent concurrency.

## Implemented / Measured / Verified
- **Implemented:** batch IDs, trace contract, and selected consistency mechanism are integrated.
- **Measured:** before/after correctness and performance metrics exist for unchanged fixtures.
- **Verified:** analyzer and integration tests pass, no issued call is lost/duplicated/non-terminal, and an independent verifier approves the evidence.

## Definition of Done
Evidence documented; sequential and parallel baselines captured; root cause identified; batch invariants implemented; tests pass; every call reaches one terminal state; no unexplained duplicates occur; session conflicts are explicit; approvals/handoffs preserve the correct batch; before/after performance is recorded; independent verification passes; no blocking issue remains.

## Customization
Extend the schema with framework-specific fields, but preserve stable batch/call identity. Replace warning-only session-version analysis with host-specific compare-and-swap checks where the orchestrator exposes versioned state. Add workload-specific benchmarks rather than relying on synthetic latency alone.
