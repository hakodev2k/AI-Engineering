# Prompt Cache Prefix Drift Profiler

**Category:** Token

## Problem
Prompt caching silently collapses when variable metadata, memory, timestamps, tool ordering, or other dynamic content appears before a provider's reusable cache boundary. Teams then pay repeated input-token and TTFT costs while assuming caching is enabled.

## Evidence
See `evidence/research.md`.

## Existing approach
Enable provider prompt caching, add cache breakpoints, and inspect aggregate cached-token counters.

## Existing limitations
Feature enablement does not prove cache reuse. Aggregates cannot identify the first byte/block that drifts, provider adapters may misreport usage, and dynamic memory or telemetry can poison an otherwise stable prefix.

## Proposed improvement
Fingerprint ordered prompt blocks across consecutive requests, locate the earliest unstable block, combine this with provider usage telemetry, and fail performance verification when avoidable drift appears before the intended cache boundary.

## Architecture
- `scripts/prefix_drift_profiler.py`
- `tests/test_prefix_drift_profiler.py`
- `schemas/request-sample.schema.json`
- `skills/cache-prefix-analysis.md`
- `rules/cache-stability.md`
- `subagents/token-optimizer.md`
- `workflows/measure-optimize-verify.md`
- `hooks/cache-regression-check.md`
- `evidence/research.md`

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/prefix_drift_profiler.py samples.json`

## Metrics
Cache-read ratio, cache-write ratio, earliest drift index, stable-prefix bytes, input tokens/task, cost/task, TTFT, quality regression rate.

## Verification
Run `python -m unittest tests/test_prefix_drift_profiler.py`.

## Safety
Do not log raw secrets or sensitive prompt content. Fingerprints are SHA-256 hashes; samples should use redacted block labels and content when possible.

## Failure handling
Invalid/missing usage data is reported as insufficient evidence, not as a cache miss. Maximum optimization iterations: 2. Never delete correctness-critical context only to improve cache rate.

## Definition of Done
**Implemented:** profiler and regression hook integrated.  
**Measured:** before/after cache and latency metrics captured.  
**Verified:** stable prefix increases or cache-read ratio improves without quality/context regression.
