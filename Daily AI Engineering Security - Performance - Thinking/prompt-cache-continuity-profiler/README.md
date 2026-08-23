# Prompt Cache Continuity Profiler

**Category:** Token

## Problem
Agent applications can suffer sudden uncached-input cost and latency spikes when stable prompt prefixes drift, cache keys change, cache lifetimes expire, or dynamic tool/catalog content moves into the reusable prefix. Provider usage counters show the symptom but usually not the first segment that caused divergence.

## Evidence
See `evidence/research.md`. Current evidence includes VS Code #321551, current OpenAI GPT-5.6 cache guidance, the August 2026 GPT-5.6 builder guide, and MCP 2026-07-28 cacheable deterministic list results.

## Existing approach
Provider cached-token telemetry, prompt ordering guidance, explicit cache keys/breakpoints, MCP cache hints, and manual prompt diffs.

## Existing limitations
Aggregate counters cannot explain prefix divergence; volatile metadata and reordered structured content can destabilize cache keys/prefixes; expiry and drift can look similar; and token optimization can accidentally remove required context.

## Proposed improvement
Record safe ordered segment fingerprints plus cache metadata and provider usage, find the earliest divergence deterministically, classify likely cause, and verify candidate optimizations against both cache metrics and result quality.

## Architecture
```text
prompt builder -> safe segment fingerprints -> model request
       |                                  -> provider usage/latency
       `-----------------------------------------> cache_profile.py
                                                    |-> pass
                                                    `-> regression -> diagnosis workflow
baseline/candidate profiles -> independent cache verifier
```

## Package tree
```text
prompt-cache-continuity-profiler/
├── README.md
├── evidence/research.md
├── config/cache-policy.json
├── skills/cache-divergence-analysis.md
├── rules/cache-continuity-rules.md
├── subagents/cache-verifier.md
├── workflows/profile-optimize-verify.md
├── hooks/post-request-cache-check.md
├── scripts/cache_profile.py
└── tests/test_cache_profile.py
```

## Installation
Python 3.10+ is sufficient for the profiler. Install `pytest` only to execute the supplied tests.

## Configuration
Tune `config/cache-policy.json` from representative tasks. Provider-specific cache TTLs, prices, and semantics belong in the host integration rather than this provider-neutral policy.

## Usage
Create a JSON request profile containing ordered `{name, sha256}` segments, token usage, latency, quality score, critical-context status, and optional cache key/model. Compare consecutive comparable requests with:

`python scripts/cache_profile.py current.json --previous previous.json --policy config/cache-policy.json --strict`

## Workflow
Use `workflows/profile-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form one hypothesis → Implement → Measure again → bounded retry → independent verification.

## Metrics
Cached-input ratio, uncached input tokens/task, cache-write tokens/task, stable-prefix/divergence position, cost/task, p50/p95 latency, quality score, and critical-context regression rate.

## Verification
Run `pytest tests/test_cache_profile.py`; collect at least three baseline and three candidate profiles per representative fixture; verify provider usage fields; have `subagents/cache-verifier.md` reproduce the comparison.

## Safety
Store hashes and safe metadata by default, not raw prompts. Cache keys must remain tenant/workspace scoped. Never trade away required security instructions, permissions, or correctness-critical context for higher cache hit rate.

## Failure handling
Detection: regression decision or failed quality/context gate. Evidence: safe profiles and provider counters. Retry: maximum two evidence-backed hypotheses. Fallback: restore previous prompt/cache configuration. Escalation: platform owner/provider investigation when local prefixes are stable. Stop on success, two failed hypotheses, insufficient telemetry, or security/correctness regression.

## Status semantics
- **Implemented:** profiler/hook integrated and deterministic tests pass.
- **Measured:** comparable baseline/candidate token, latency, and quality data exists.
- **Verified:** independent review confirms improved or policy-compliant cache behavior with no critical context loss.

## Definition of Done
Research documented; baseline captured; cause classified; improvement implemented; tests pass; cache/cost/latency metrics collected; quality non-regressed; critical context retained; tenant boundaries preserved; independent verifier marks Verified; no blocking issue remains.

## Customization
Add provider adapters for exact pricing, TTL, explicit cache-write behavior, or cache-breakpoint metadata without changing the core fingerprint and quality gates.
