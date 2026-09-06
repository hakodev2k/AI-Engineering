# Reasoning-Effort Cache Transition Guard

## Topic
Preventing avoidable prompt-cache invalidation when reasoning effort changes during long-running agent sessions.

## Category
Token

## Problem
A long session can remain functionally correct while silently losing prompt-prefix cache reuse if dynamic reasoning effort is changed through a request-level field that participates in cache identity. With GPT-6 Astra, OpenAI now documents a cache-preserving `configuration_update` mechanism for compatible standard single-agent Responses API flows, but current integration code can still use the older mutation path.

## Evidence
See `evidence/research.md`. Key signals are OpenAI's GPT-6 Astra release and model guidance dated/current 2026-09-03 to 2026-09-06 plus Codex issue #42996 opened 2026-09-05.

## Existing approach
Provider prompt caching, stable prompt prefixes, dynamic reasoning routing, request telemetry, and application-level cost/latency monitoring.

## Existing limitations
Correct responses do not prove cache continuity. A migration can support the new item type internally yet keep using request-level effort mutation in the normal control path. Cache counters without request-shape evidence identify a symptom but not the invalidating transition.

## Proposed improvement
Normalize request traces and add a deterministic gate that detects request-level reasoning-effort mutations in flows explicitly declared compatible with cache-preserving `configuration_update`. Pair the shape check with before/after measurements of cached input, cache writes, uncached input, latency, cost when known, and unchanged acceptance-test quality.

## Architecture
- `evidence/research.md` — current public evidence and root-cause analysis.
- `skills/cache-transition-analysis.md` — measurement and migration procedure.
- `rules/cache-prefix-stability.md` — observable token/correctness invariants.
- `subagents/cache-verifier.md` — independent verifier.
- `workflows/baseline-migrate-verify.md` — bounded baseline/migration workflow.
- `hooks/request-shape-check.md` — deterministic completion/release hook contract.
- `scripts/cache_transition_audit.py` — dependency-free JSONL trace auditor.
- `tests/test_cache_transition_audit.py` — valid, invalid, incompatible and malformed fixtures.

## Actual package tree
```text
reasoning-effort-cache-transition-guard/
├── README.md
├── evidence/research.md
├── hooks/request-shape-check.md
├── rules/cache-prefix-stability.md
├── scripts/cache_transition_audit.py
├── skills/cache-transition-analysis.md
├── subagents/cache-verifier.md
├── tests/test_cache_transition_audit.py
└── workflows/baseline-migrate-verify.md
```

## Installation
Requires Python 3.9+ with only the standard library. Instrument the integration to emit one JSON object per request into a local JSONL trace. Prompt bodies need not be logged; use hashes/lengths if sensitive.

## Trace schema
Required fields:
```json
{"session_id":"s1","seq":1,"request_reasoning_effort":"low","input_items":[]}
```
Optional measurable fields: `input_tokens`, `cached_input_tokens`, `cache_write_tokens`, `latency_ms`, `quality_pass`, and cost fields used by your own benchmark harness.

A compatible effort transition may appear as:
```json
{"session_id":"s1","seq":2,"request_reasoning_effort":"low","input_items":[{"type":"configuration_update","reasoning":{"effort":"high"}}]}
```

## Usage
For a topology confirmed compatible by current provider documentation:
```sh
python3 scripts/cache_transition_audit.py --trace trace.jsonl --compatible
```

Exit codes: `0=pass`, `10=review`, `20=fail`, `30=invalid input`. Without `--compatible`, request-level mutations are reported as `review` rather than automatically failed because some topologies may require a different transition mechanism.

Run tests:
```sh
python3 -m unittest tests/test_cache_transition_audit.py
```

## Workflow
Follow `workflows/baseline-migrate-verify.md`: capture an equivalent baseline, diagnose effort transitions, establish compatibility, migrate only the transition serialization path, repeat the same workload, compare cache/cost/latency and quality, then require independent verification.

## Metrics
Primary metrics are cached-input ratio, cache-write tokens/task, uncached input/task, total input/task, cost/task, p50/p95 latency, quality pass rate, and invalid request-level transition count. When provider counters are unavailable, the request-shape result can be `Implemented` but cache benefit remains unmeasured.

## Verification
### Implemented
The compatible transition path is serialized without mutating request-level `reasoning.effort`, and trace collection plus audit are integrated.

### Measured
Equivalent baseline/candidate workloads have cache, token, cost/latency and quality metrics captured. Use repeated runs; at least three baseline and three candidate runs are recommended when cost permits.

### Verified
An independent verifier confirms zero invalid request-level transitions in declared compatible sessions, equivalent workloads, no critical context removal, quality within tolerance, and measured cache/cost/latency evidence supporting the claimed improvement.

## Safety and correctness
Token optimization is subordinate to correctness. Never delete instructions, evidence, retrieval results, or state required for task success merely to increase cache ratio. Do not inject `configuration_update` into unsupported or unknown topologies; use a documented fallback or stable effort and mark the optimization unverified.

## Failure handling
Detection: audit failure, cache-ratio regression, increased cache writes, latency regression, or quality failure. Evidence: retain normalized traces and benchmark summaries. Retry: maximum two tuning iterations, each requiring new evidence or a changed hypothesis. Fallback: restore the last correct request shape or keep stable request-level effort. Escalation: platform/provider integration owner. Stop: unresolved compatibility, quality regression beyond tolerance, or two unsuccessful iterations.

## Definition of Done
- current evidence and official guidance documented
- baseline captured before migration
- compatibility explicitly established
- transition path implemented
- deterministic tests pass
- baseline/candidate metrics collected when exposed
- before/after comparison completed
- correctness-critical context preserved
- quality acceptance tests remain within tolerance
- independent verification complete
- no blocking compatibility or cache-regression issue remains

## Customization
Adapt the trace normalizer to the host SDK while preserving required semantic fields. Add provider-specific cache counters or pricing calculations outside the core auditor. If additional configuration items affect cache identity, extend the audit with fixtures before enforcing them.
