# Prompt Cache Prefix Stability Regression Guard

## Topic
Prevent avoidable prompt-cache misses caused by unstable prefixes, tool-schema churn, and volatile context placement in tool-heavy agents.

## Category
Token / Performance

## Problem
Tool-using agents frequently resend large system prompts and tool schemas. Even when providers support prompt caching, small changes in early request content can invalidate the reusable prefix and turn repeated internal agent calls into fully billed, slower input processing.

## Evidence
Current public evidence is recorded in `evidence/research.md`, including 2026 agent-framework issues reporting large uncached tool-schema overhead and current platform documentation describing byte/prefix stability as a cache requirement.

## Existing approach and limitation
Provider-native prompt caching, static cache breakpoints, and manual prompt ordering help, but teams often lack a regression test that proves cacheable prefixes remain stable after tool registration, context compaction, timestamps, schema serialization, or middleware changes.

## Proposed improvement
Add a deterministic cache-prefix profiler and regression gate. It partitions request content into stable and volatile regions, canonicalizes tool schema serialization, fingerprints the cacheable prefix, records token/component estimates, and fails CI or agent startup when unexpected prefix churn or cacheable-token regression exceeds policy thresholds.

## Architecture
1. `skills/cache-prefix-analysis.md` — repeatable baseline/diagnosis procedure.
2. `rules/cache-stability.md` — enforceable cache hygiene and correctness invariants.
3. `subagents/cache-benchmark-verifier.md` — independent before/after verifier.
4. `workflows/profile-stabilize-verify.md` — bounded optimization loop.
5. `hooks/preflight-cache-regression.md` — deterministic preflight gate.
6. `scripts/cache_prefix_guard.py` — component profiler and regression checker.
7. `config/cache-policy.json` — safe thresholds.
8. `tests/test_cache_prefix_guard.py` — deterministic regression tests.

## Package tree
```text
README.md
evidence/research.md
skills/cache-prefix-analysis.md
rules/cache-stability.md
subagents/cache-benchmark-verifier.md
workflows/profile-stabilize-verify.md
hooks/preflight-cache-regression.md
scripts/cache_prefix_guard.py
config/cache-policy.json
tests/test_cache_prefix_guard.py
```

## Installation
Python 3.10+; no third-party dependencies. Provider telemetry can be supplied later as JSON, but the deterministic prefix checks work offline.

## Usage
```bash
python scripts/cache_prefix_guard.py current.json --policy config/cache-policy.json
python scripts/cache_prefix_guard.py current.json --baseline baseline.json --policy config/cache-policy.json
python -m unittest tests/test_cache_prefix_guard.py
```

## Workflow
Measure baseline → decompose request components → identify volatile-before-stable content → canonicalize eligible schemas/static blocks → move volatile content after stable prefix when semantically safe → measure again → compare prefix fingerprint/component size → verify provider cache metrics → complete only if quality/security tests remain unchanged.

## Metrics
Cacheable prefix bytes/tokens, changed-prefix rate, tool-schema bytes, static-vs-volatile ratio, provider cache hit tokens, cache miss tokens, input cost/task, latency/task, and task-quality regression rate.

## Verification
**Implemented:** profiler, policy, regression gate, tests, workflow.  
**Measured:** capture baseline and post-change component profiles plus provider usage when available.  
**Verified:** cacheable prefix is stable across repeated equivalent turns, cache hit ratio improves or remains above target, total input cost/latency improves on representative tasks, and correctness/security fixtures do not regress.

## Safety
Do not remove required system policy, authorization context, safety instructions, or task-critical evidence merely to improve cache reuse. Optimization must preserve semantic correctness and trust boundaries.

## Failure handling
Invalid manifests or missing required components fail the regression check. Optimization attempts are limited to two iterations; if cache reuse does not improve without quality loss, retain the safer baseline and document the bottleneck.

## Definition of Done
- Baseline captured.
- Prefix components classified.
- Unexpected churn source identified.
- Stable serialization enforced where appropriate.
- Regression test passes.
- Provider cache metrics measured when available.
- No quality/security regression.
- Before/after evidence recorded.

## Customization
Tune thresholds and volatile-key patterns in `config/cache-policy.json`. Provider-specific cache metrics may be mapped into the same workflow without changing the stable-prefix invariant.
