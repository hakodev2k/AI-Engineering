# Tool Schema Order Cache Stability Gate

**Category:** Token / Performance

## Problem
Semantically identical agent tool sets can serialize differently because discovery order, registry insertion order, nested JSON key order, or volatile metadata changes. Since prompt caches reuse matching prefixes, this can convert otherwise reusable tool-heavy prefixes into uncached input.

## Evidence
See `evidence/research.md`. Current 2026 VS Code diagnostics, Browser Use issue reports, Qwen Code design guidance, and OpenAI engineering guidance all point to exact/stable request prefixes as a practical cache-performance concern.

## Existing approach and limitation
Provider prompt caching and aggregate cached-token counters help, but they usually do not prevent nondeterministic tool serialization before deployment or prove that equivalent logical tool sets are byte-stable.

## Proposed improvement
Canonicalize nested tool JSON, strip explicitly non-semantic volatile metadata, sort by stable tool identity, fingerprint the resulting tool prefix, and gate repeated equivalent fixtures. Then verify real cached-token/latency impact with correctness guardrails.

## Architecture
```text
dynamic registry/MCP discovery
          |
          v
  semantic tool set
          |
          v
canonicalize nested JSON
+ stable identity sort
+ remove non-semantic volatility
          |
          v
stable prefix bytes + SHA-256
          |
          +--> deterministic CI gate
          |
          +--> runtime cache/latency benchmark
```

## Package tree
```text
README.md
evidence/research.md
skills/tool-prefix-stability-analysis.md
rules/cache-stability-rules.md
subagents/cache-benchmark-verifier.md
workflows/measure-stabilize-verify.md
scripts/canonicalize_tools.py
tests/stability-fixtures.md
```

## Installation
Python 3.9+ is sufficient for the canonicalizer. No third-party dependency is required.

## Configuration
Define stable tool identity using `namespace`, `name`, and `version` where available. The script strips `request_id`, `session_id`, `discovered_at`, and `timestamp` by default because those fields are expected to be non-semantic metadata; use `--keep-volatile` when they are actually required for tool semantics.

## Usage
1. Capture at least three logically equivalent raw tool snapshots.
2. Follow `skills/tool-prefix-stability-analysis.md`.
3. Enforce `rules/cache-stability-rules.md`.
4. Run `scripts/canonicalize_tools.py` against the fixtures in `tests/stability-fixtures.md`.
5. Execute `workflows/measure-stabilize-verify.md` with representative cache/latency telemetry.
6. Use `subagents/cache-benchmark-verifier.md` for independent verification.

## Metrics
Fingerprint stability, cached-input ratio, uncached input tokens/task, p50/p95 model latency/TTFT, and tool-selection correctness.

## Verification
**Implemented:** canonicalization is integrated. **Measured:** repeated before/after requests and fingerprints are recorded. **Verified:** equivalent fixtures are byte-stable, semantic changes alter fingerprints, runtime cache or latency improves measurably, and no critical tool/correctness regression exists.

## Safety and correctness
Never remove required tools or correctness-critical context solely to increase cache hits. If a volatile field is semantically required, preserve it and accept/document the resulting cache boundary.

## Failure handling
Detection: fingerprint variance or runtime cache regression. Evidence: raw/canonical fingerprints and provider usage counters. Retry: maximum two hypotheses. Fallback: revert canonicalization change. Escalation: runtime/tool-registry owner. Stop: exhausted retries, quality regression, or confirmed correctness-required volatility.

## Definition of Done
- Current evidence documented.
- Baseline fingerprint/cache metrics captured.
- Canonicalization implemented.
- Equivalent fixture stability = 100%.
- Semantic-change fixture changes fingerprint.
- No required tools are lost.
- Representative after measurement shows measurable benefit.
- Independent verification passes.
- No blocking quality regression remains.

## Customization
Extend the volatile-field policy and identity tuple for your registry, but keep the semantic-set distinction: only logically equivalent tool sets should be required to share a fingerprint.
