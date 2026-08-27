# Agent Prompt Cache Prefix Profiler

**Category:** Token

## Problem
Tool-heavy and long-running agents can repeatedly resend large static prefixes when tool/system prompt mutations or cache-breakpoint placement invalidate prefix reuse. High overall cache usage can still hide expensive static replay.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`.

## Existing approach
Provider prompt caching, session compaction, deferred tool loading, tool search and manual prompt minimization.

## Existing limitations
Cache hit rate alone does not identify which prefix mutation caused replay; tool-schema size and cache creation cost can be hidden; dynamic tool changes can invalidate the earliest prefix; optimization is often accepted without comparable task-quality checks.

## Proposed improvement
A deterministic trace profiler that fingerprints tool/system prefixes, measures read/create ratios and static replay, reports mutation events, and verifies before/after improvements against token, latency and quality thresholds.

## Architecture
```text
agent-prompt-cache-prefix-profiler/
├── README.md
├── evidence/research.md
├── config/thresholds.json
├── scripts/cache_prefix_profiler.py
├── tests/test_cache_prefix_profiler.py
├── skills/cache-prefix-analysis.md
├── rules/token-cache-policy.md
├── subagents/cache-benchmark-reviewer.md
├── workflows/measure-optimize-verify.md
└── hooks/post-trace-benchmark.md
```

## Installation
Python 3.10+; no third-party packages.

## Configuration
Set acceptance gates in `config/thresholds.json` before measuring the candidate change. Do not loosen thresholds after seeing results.

## Usage
Baseline only:
`python scripts/cache_prefix_profiler.py --before before.jsonl`

Before/after verification:
`python scripts/cache_prefix_profiler.py --before before.jsonl --after after.jsonl --thresholds config/thresholds.json`

Each JSONL row requires: `task_id`, `input_tokens`, `cache_read_tokens`, `cache_creation_tokens`, `latency_ms`, `tool_fingerprint`, `system_fingerprint`, `static_prefix_tokens`, and `quality_pass`.

## Workflow
Observe → measure baseline → diagnose fingerprint/cache mutations → form one hypothesis → optimize → measure again → compare thresholds → independent verification.

## Metrics
Input tokens/task; cache-read ratio; cache-creation ratio; static replay tokens/task; p50/p95 latency; quality pass rate; mutation count.

## Verification
Run `python -m unittest tests/test_cache_prefix_profiler.py`, then execute `hooks/post-trace-benchmark.md` on representative before/after traces. Independent review is required.

## Safety
Never delete correctness-critical context simply to save tokens. Never conceal failed tasks from the quality denominator. Preserve security/tool authorization context even when it reduces cache efficiency.

## Failure handling
**Detection:** profiler threshold failure or insufficient evidence.  
**Evidence:** raw comparable traces and profiler JSON.  
**Retry policy:** at most 2 optimization hypotheses.  
**Maximum retries:** 2 measured optimization attempts.  
**Fallback:** restore baseline prompt/tool configuration.  
**Escalation:** provider/cache behavior contradicts documented semantics or workload cannot be made comparable.  
**Stop condition:** quality regression, no measurable hotspot, non-comparable traces, or two rejected hypotheses.

## Definition of Done
**Implemented:** trace collection fields, profiler, policy rules and benchmark hook integrated.  
**Measured:** before and after traces collected on representative tasks.  
**Verified:** static replay/tokens improve, configured cache and latency thresholds pass, quality remains within threshold, independent reviewer passes, and no required context was lost.

## Customization
Adapters may compute fingerprints from canonical serialized tool/system objects. Keep serialization deterministic and keep acceptance thresholds external to the measured change.
