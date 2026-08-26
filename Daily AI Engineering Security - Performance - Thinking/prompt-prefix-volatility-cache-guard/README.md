# Prompt Prefix Volatility Cache Guard

**Category:** Token

## Problem
Small volatile values inserted early in agent prompts—session paths, dates, working directories, hook-generated context, or notification-dependent system content—can invalidate a large reusable prompt prefix, causing repeated cache writes, higher token cost, and latency.

## Evidence
See `evidence/research.md` for current public reports from Claude Code, Prime Agent, oh-my-pi, and The Last Harness.

## Existing approach
Provider prompt caching, manual cache breakpoints, prompt compaction, and tool search reduce repeated input cost when prefixes stay stable.

## Existing limitations
Caching is byte/prefix sensitive; a tiny early change can destroy reuse. Instrumentation often reports cache reads/writes without attributing the miss to the first changed prompt segment.

## Proposed improvement
Profile prompt segments by stability and position, detect volatile content inside the cacheable prefix, quantify its downstream token blast radius, and gate changes that exceed an explicit cache-churn budget.

## Architecture
- `evidence/research.md` — public evidence and root-cause analysis
- `skills/prefix-volatility-analysis.md` — reusable procedure
- `rules/cache-stability.md` — enforceable token rules
- `subagents/cache-verifier.md` — independent verifier
- `workflows/measure-optimize-verify.md` — baseline and optimization loop
- `hooks/pre-prompt-build.md` — deterministic check
- `scripts/prefix_volatility.py` — segment-diff profiler
- `tests/test_prefix_volatility.py` — regression tests

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/prefix_volatility.py --previous previous.json --current current.json --budget 2000`

## Metrics
Cache-read tokens/task, cache-creation tokens/task, changed-prefix blast-radius tokens, cache hit ratio, latency/task, cost/task, quality regression rate.

## Verification
Run `python -m unittest tests/test_prefix_volatility.py`.

## Safety
Required correctness context is never removed merely to save tokens. The guard recommends moving or isolating volatile context; it blocks only when a configured cache-churn budget is violated.

## Failure handling
If segment telemetry is missing, report `insufficient_evidence` and do not claim savings. Optimization retries are limited to 2.

## Definition of Done
**Implemented:** prompt segments carry stable IDs and the pre-build hook runs.  
**Measured:** before/after token/cache metrics exist.  
**Verified:** churn falls within budget with no required-context loss or quality regression.

## Customization
Set budgets by model/provider and workload; preserve correctness-critical content even if it is volatile.
