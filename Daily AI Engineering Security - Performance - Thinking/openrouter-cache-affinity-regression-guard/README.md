# OpenRouter Cache Affinity Regression Guard

**Category:** Token

## Problem
Multi-turn agents can silently lose prompt-cache reuse when session identity, reusable prompt prefixes, provider routing, or cache eligibility changes. Tasks still complete, but repeated instructions and tool schemas are processed as fresh input, increasing token cost and often latency.

## Evidence
`evidence/research.md` documents independent July–August 2026 reports in Zoo Code and Hermes Agent plus current OpenRouter guidance recommending stable `session_id` for multi-turn agentic workflows and measured `cached_tokens` verification.

## Existing approach
Use OpenRouter sticky routing with a stable `session_id`, preserve stable prompt prefixes, add explicit cache controls where required, and inspect provider usage telemetry.

## Existing limitations
Configured session IDs may still drift per turn; provider failover creates legitimate cold turns; dynamic prefix metadata invalidates caches; static cache-capable model allowlists become stale; functional tests do not fail when cache reuse disappears.

## Proposed improvement
Treat cache affinity as a measurable run invariant. Profile sanitized per-call telemetry, enforce stable session/prefix identity, tolerate a bounded number of failover-related cold turns, and gate optimizations on before/after fresh-input-token evidence plus unchanged result quality.

## Architecture
```text
openrouter-cache-affinity-regression-guard/
├── README.md
├── config/
│   └── thresholds.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-run-cache-check.md
├── rules/
│   └── cache-budget.md
├── scripts/
│   └── cache_affinity_profiler.py
├── skills/
│   └── cache-affinity-investigation.md
├── subagents/
│   └── token-verifier.md
├── tests/
│   └── test_cache_affinity_profiler.py
└── workflows/
    ├── measure-optimize.md
    └── regression-verification.md
```

## Installation
Python 3.10+; no third-party Python packages required.

## Configuration
Tune `config/thresholds.json` using a representative workload. Thresholds are regression gates, not universal provider guarantees. Keep `require_stable_session_id` and `require_stable_prefix_hash` enabled unless a documented workflow intentionally changes them.

## Trace format
One JSON object per line with:
- `session_id`: stable logical agent/session identifier
- `prefix_hash`: privacy-safe hash of the intended reusable prefix
- `provider`: routed provider/endpoint identity when available
- `input_tokens`: request input-token count
- `cached_tokens`: provider-reported cached-token count

Do not include raw prompts, authorization headers or secrets.

## Usage
`python scripts/cache_affinity_profiler.py --trace candidate.jsonl --thresholds config/thresholds.json`

For measured comparison:
`python scripts/cache_affinity_profiler.py --trace candidate.jsonl --thresholds config/thresholds.json --baseline baseline.jsonl`

Exit 0 means configured gates pass; exit 3 means a measurable regression/invariant violation; exit 2 means invalid input.

## Workflow
Use `workflows/measure-optimize.md` to establish baseline, diagnose, change one variable, remeasure, and independently verify. Use `workflows/regression-verification.md` for routing/model/prompt changes and `hooks/post-run-cache-check.md` as a deterministic post-run gate.

## Metrics
- input tokens/task
- fresh input tokens/task
- cache-hit ratio
- cached-token share
- provider changes
- longest cold streak
- result-quality regression rate
- latency/task when captured by the surrounding telemetry system

## Verification
Run `python -m unittest tests/test_cache_affinity_profiler.py`, then execute the same representative workload before and after the change. Cache success must be supported by provider-reported telemetry, not inferred from configuration.

## Safety
Never remove correctness-critical instructions, security policy, tool schemas, evidence or authorization checks solely to improve cache metrics. Store only sanitized hashes/usage counters in regression fixtures.

## Failure handling
Detection: profiler violation or cost/latency regression. Evidence: sanitized trace and before/after metrics. Retry: maximum 2 diagnosis revisions. Fallback: restore the last verified request path and preserve full required context. Escalation: provider/integration owner. Stop condition: exhausted retries, unreliable telemetry, or quality/security regression.

## Definition of Done
**Implemented:** stable session/prefix handling and telemetry gate are integrated.  
**Measured:** baseline/candidate traces and token/cache metrics exist.  
**Verified:** deterministic tests pass, representative workload shows similar/better quality with improved or preserved cache metrics, independent reviewer confirms the result, and no required context is lost.

## Customization
Extend the trace adapter for provider-specific fields or add latency/cost columns, while keeping the core invariants provider-neutral and evidence-based.
