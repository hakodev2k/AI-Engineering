# Read-Only Tool Result Reuse Guard

**Category:** Performance

## Problem
Long-running AI agents frequently re-run identical or semantically equivalent read-only tool calls such as web fetches, search, file reads, directory listings, diagnostics, and retrievers. The duplicate work increases external API latency and cost, consumes model context with repeated outputs, and can accelerate compaction. Existing caches are often absent, too coarse, unsafe for mutable/write tools, or difficult to verify.

## Evidence
See `evidence/research.md` for August 2026 research evidence from AgentSysBench, Haystack, Docker Agent, and Hermes Agent.

## Existing approach
Frameworks use ad hoc in-memory memoization, loop warnings, tool-specific caches, or result truncation. Some proposals key on tool name plus normalized arguments and opt in only idempotent tools.

## Existing limitations
- Truncation reduces one payload but does not prevent repeated execution.
- Exact-key caches do not handle stale-state risk or scope boundaries by themselves.
- Loop detectors may warn after the duplicate external call already occurred.
- Cross-session caches can create data leakage or stale-result hazards.
- Teams often lack baseline duplicate-rate and latency evidence before enabling caching.

## Proposed improvement
A deterministic profiler and policy gate for read-only tool reuse. It canonicalizes tool name/arguments, records output digests and timestamps, computes duplicate execution rate and avoidable latency, recommends only same-scope reuse within declared TTLs, and blocks caching for write/side-effecting tools.

## Architecture
```text
config/reuse-policy.json
scripts/tool_reuse_profiler.py
tests/test_tool_reuse_profiler.py
skills/tool-reuse-analysis.md
rules/tool-result-reuse.md
subagents/performance-verifier.md
workflows/measure-optimize.md
hooks/pre-tool-call.md
evidence/research.md
README.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Declare explicitly cacheable read-only tools, TTLs, cache scope, and never-cache tools in `config/reuse-policy.json`.

## Usage
```bash
python scripts/tool_reuse_profiler.py --trace trace.jsonl --policy config/reuse-policy.json
```

Each trace line records `timestamp_ms`, `tool`, `args`, `latency_ms`, `output_digest`, and `scope_id`.

## Workflow
Measure duplicate executions first, identify safe read-only candidates, enable narrowly scoped reuse, then remeasure latency and task correctness. Maximum two optimization attempts.

## Metrics
Duplicate-call rate, avoidable external calls, avoidable latency, cache hit rate, stale-result failures, task success, token volume from repeated tool outputs.

## Verification
Run:
```bash
python -m unittest tests/test_tool_reuse_profiler.py
```

## Safety
Write, mutation, credential, messaging, deployment, payment, and other side-effecting tools MUST NOT be cached. Cache scope MUST NOT cross tenant/user boundaries unless explicitly proven safe. Correctness-critical freshness requirements override performance savings.

## Failure handling
If a result is stale, scope cannot be proven, or tool semantics are not read-only, disable reuse for that tool. Maximum two tuning attempts before escalation.

## Definition of Done
**Implemented:** policy, profiler, hook, workflow, rules, and tests exist.  
**Measured:** baseline duplicate rate and latency are captured.  
**Verified:** fewer external calls or lower latency are demonstrated on the same workload, tests pass, task quality is not reduced, and no side-effecting tool is cached.

## Customization
Add tools only after documenting idempotence, freshness tolerance, cache scope, and invalidation conditions.
