# Subagent Prompt Cache Locality Profiler

## Topic
Measure and control prompt-cache locality across parallel/fan-out subagents so shared context does not silently multiply cache-write tokens per sibling.

## Category
Token / Performance

## Problem
Parallel children often share system instructions, tool schemas, criteria, and parent context, yet small child-specific differences, unstable tool manifests, cache-breakpoint placement, isolated namespaces, or short TTLs can force each sibling to re-create substantial prompt prefixes. Overall cache-hit percentages can hide this amplification.

## Evidence
`evidence/research.md` contains current measured reports from 2026 Claude Code issues (#82739, #81967, #63981, #74318), GitHub guidance on preserving cache in agentic coding, and current OpenAI request-level cache controls. It separates observed evidence, interpretation, existing approaches, limitations, and the proposed improvement.

## Existing approach
Provider-side automatic prompt caching, session-level token dashboards, manual prompt shortening, generic cache regression alarms, and ad hoc sequentialization.

## Existing limitations
Session totals do not show how much cache each sibling creates; good read ratios can coexist with one expensive creation per child; streaming transcripts may double-count request records; provider semantics differ; generic cache alerts do not identify fan-out topology or prompt-structure causes.

## Proposed improvement
Normalize and deduplicate request-level usage, group it by dispatch/fan-out, measure cache-write share and sibling write amplification, identify structural locality hotspots, then test one bounded orchestration/prompt-layout hypothesis at a time. Accept savings only when quality and security context are preserved.

## Architecture
The package contains evidence, enforceable token/performance rules, a reusable investigation skill, an independent benchmark verifier, a bounded measure-optimize-verify workflow, a blocking post-run budget hook, threshold configuration, an executable provider-neutral JSONL profiler, and regression tests.

## Package tree
```text
subagent-prompt-cache-locality-profiler/
├── README.md
├── config/
│   └── thresholds.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-run-cache-budget.md
├── rules/
│   └── cache-locality-budget.md
├── scripts/
│   └── cache_locality_profiler.py
├── skills/
│   └── cache-locality-investigation.md
├── subagents/
│   └── benchmark-verifier.md
├── tests/
│   └── test_cache_locality_profiler.py
└── workflows/
    └── measure-optimize-verify.md
```

## Installation
Requires Python 3.10+ and only the standard library. Export or transform runtime/provider usage data to JSONL with one logical API request per `request_id`.

## Input format
Each JSONL record requires:
```json
{"request_id":"r1","agent":"reviewer-a","dispatch_group":"audit-42","input_tokens":150,"cache_creation_tokens":12000,"cache_read_tokens":45000}
```
Optional fields: `model`, `tool_manifest_hash`, `latency_ms`, and `quality_pass`.

## Configuration
Tune `config/thresholds.json` from measured workloads. Do not loosen thresholds simply to clear a failing run. Thresholds are budget policy, not provider guarantees.

## Usage
Profile a candidate run:
```bash
python scripts/cache_locality_profiler.py candidate.jsonl --thresholds config/thresholds.json
```
Compare an optimization with the unchanged baseline:
```bash
python scripts/cache_locality_profiler.py candidate.jsonl --thresholds config/thresholds.json --baseline baseline.jsonl
```
Exit codes: `0` pass, `2` invalid/incomplete telemetry, `3` threshold or quality regression.

Run package tests:
```bash
python -m unittest tests/test_cache_locality_profiler.py
```

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Optimize → Measure again → bounded re-evaluation → quality/security gate → independent verification.

## Metrics
Cache creation/read/uncached input tokens per task and sibling, cache-write share, sibling write amplification, marginal fan-out creation tokens, tokens/task, cost/task, latency/task, tool-manifest variants, and quality pass rate.

## Verification
Use comparable baseline/candidate workloads and stable quality criteria. Deduplicate request IDs. Recompute the worst dispatch group independently. Lower tokens are accepted only if required context remains, security/tool permissions are unchanged or stronger, and quality does not regress.

## Safety
Never remove safety instructions, authorization context, required repository state, or correctness-critical evidence solely to save tokens. Never weaken tool boundaries or permissions for cache reuse. Sanitize transcripts before sharing them; usage metrics normally do not require prompt contents.

## Failure handling
Detection: profiler exit `2`/`3`, cost alert, or independent-verifier disagreement. Evidence: preserve raw sanitized telemetry and reports. Retry: maximum 2 changed hypotheses. Fallback: revert to known-good structure and bound/serialize fan-out. Escalation: runtime/provider owner when the remaining cause is external. Stop when retry budget is exhausted or further savings require context/quality/security loss.

## Definition of Done
- **Implemented:** request-level telemetry is normalized, deduplicated, grouped, and budget-checked.
- **Measured:** baseline and candidate cache locality/token/latency/quality metrics are captured on comparable work.
- **Verified:** cache creation or amplification improves to target, quality/security do not regress, tests pass, and an independent verifier reproduces the key result.

## Customization
Add provider adapters upstream of the normalized JSONL contract rather than embedding provider assumptions in the profiler. Add dispatch dimensions such as team, spawn depth, agent type, cache key, or TTL only when they improve root-cause attribution and remain observable.
