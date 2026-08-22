# Prompt Cache Prefix Stability Guard

Category: **Token / Performance**

## Problem
Prompt caching is prefix-sensitive. Agent runtimes can reorder tool schemas, agent/skill lists, or dynamic prompt blocks between equivalent turns, invalidating large static prefixes and causing avoidable token cost and latency.

## Evidence
See `evidence/research.md`. Current 2026 reports from Claude Code, Qwen Code, OpenCode, and Hermes Agent independently document cache misses caused by non-deterministic tool ordering or dynamic bytes appearing before cacheable static prefixes.

## Existing approach and limitation
Most runtimes enable provider caching and assume repeated prompts are stable. Provider caching cannot help if host serialization changes byte order or places volatile session-specific content ahead of large static blocks.

## Proposed improvement
Create a deterministic prefix manifest, canonicalize stable tool/agent/schema ordering, fingerprint each cache segment, and compare equivalent turns before dispatch. Fail performance verification when static-prefix drift is unexplained.

## Package tree
- `evidence/research.md`
- `skills/prefix-stability-audit.md`
- `rules/cache-prefix-stability.md`
- `workflows/measure-stabilize-verify.md`
- `hooks/pre-dispatch-prefix-check.md`
- `scripts/prefix_stability_guard.py`
- `config/policy.json`

## Installation
Python 3.10+, standard library only.

## Usage
Export two normalized request manifests (baseline and candidate), then run:

`python scripts/prefix_stability_guard.py baseline.json candidate.json --policy config/policy.json`

Exit `0` means stable required segments; `3` indicates regression; `2` indicates invalid inputs.

## Metrics
Cache-hit tokens/request, cache-creation tokens/request, stable-prefix bytes/tokens, first divergent segment, cost/task, latency/task, and quality regression rate.

## Verification
Equivalent semantic toolsets with shuffled registration order MUST produce the same canonical stable-prefix digest. Meaningful schema/instruction changes MUST change the digest.

## Safety
Never delete correctness-critical instructions or tool schemas merely to increase cache hits. Stability optimizations MUST preserve semantics, permissions, and required context.

## Failure handling
Retry comparison only after refreshing request capture; maximum 2 retries. If drift persists, preserve correctness and report the divergent segment instead of suppressing required context.

## Definition of Done
Implemented: canonicalization and drift detector exist. Measured: before/after cache telemetry captured. Verified: equivalent requests yield stable prefix fingerprints and improved cache reuse without quality or correctness regression.