# Tool Schema Prefix Cache Stability

**Category:** Token  
**Run date:** 2026-08-28 (UTC+7)

## Problem
Tool-heavy coding agents can lose prompt/prefix cache reuse when an identical semantic tool set is serialized differently, deferred tools alter the prefix, or volatile data is inserted before stable prompt blocks. The result is avoidable uncached input tokens, higher cost and slower TTFT.

## Evidence
See `evidence/research.md`. Current signals include Qwen Code's August 2026 prompt-cache work on stable global tool ordering and active cache issues, the TraceLab coding-agent workload study, and measured differences in coding-agent cache hit rates.

## Existing approach
Provider prompt caching, ToolSearch/deferred loading, prompt compaction and ad-hoc stable ordering.

## Existing limitations
Provider caches cannot reuse a prefix the client itself mutates. Teams often lack normalized cache telemetry and can accidentally improve token metrics by dropping correctness-critical context.

## Proposed improvement
Make cacheability an observable invariant: canonicalize tool fingerprints, detect order drift, enforce token/cache/quality budgets, measure equivalent workloads and independently verify before/after results.

## Architecture
```text
README.md
evidence/research.md
config/budget.example.json
skills/context-cache-audit.md
rules/token-cache-rules.md
subagents/cache-investigator.md
subagents/verification-agent.md
workflows/measure-optimize-verify.md
hooks/preflight-cache-check.md
scripts/context_cache_analyzer.py
tests/test_context_cache_analyzer.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Copy `config/budget.example.json` and tune only before an experiment or with recorded rationale. Trace rows may include `prompt_tokens`, `cached_tokens`, `tools`, `ttft_ms`, `latency_ms`, and `quality_pass`.

## Usage
```bash
python scripts/context_cache_analyzer.py traces.jsonl --budget config/budget.example.json --json-out cache-report.json
python -m unittest tests/test_context_cache_analyzer.py
```

## Workflow
Follow `workflows/measure-optimize-verify.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → independent verification. Maximum optimization retries: 2.

## Metrics
Cache hit ratio; uncached input tokens/task; tool-schema bytes/request; same-set order-drift groups; TTFT p50/p95; latency p95; quality pass rate.

## Verification
- **Implemented:** deterministic analysis and enforceable cache rules are integrated.
- **Measured:** baseline and optimized traces from equivalent workloads exist.
- **Verified:** target metrics improve, budget/tests pass and required tools/context remain intact.

## Safety
Never remove required policy, evidence, permissions or task-critical context to save tokens. Dynamic tool selection must fail safely and restore required tools when needed.

## Failure handling
Invalid evidence or a budget breach blocks completion. Retry at most twice, then restore the last known-good prompt/tool assembly and escalate with reports.

## Definition of Done
Evidence documented; baseline captured; root cause tied to measured prompt/cache behavior; optimization implemented; tests pass; before/after metrics collected; quality preserved; independent verification complete; no required context silently removed.

## Customization
Extend adapters for provider-specific telemetry, but keep canonical tool fingerprints and quality gates stable so results remain comparable.
