# Read-Only Tool Result Reuse Guard

**Category:** Token

## Problem
Agent runtimes repeatedly resend unchanged read-only tool results, consuming tokens, accelerating compaction, and increasing latency without adding information.

## Evidence
See `evidence/research.md`.

## Existing approach
Single-result truncation, prompt caching, compaction, and generic memoization reduce some overhead but do not reliably prove freshness of repeated tool results.

## Existing limitations
Repeated unchanged payloads remain context-consuming; invalidation is often underspecified; unsafe reuse can hide mutations.

## Proposed improvement
Fingerprint eligible read-only invocations/results, bind reuse to dependency fingerprints and TTLs, and emit compact references only for exact unchanged repeats.

## Architecture
`evidence/research.md`, `config/policy.json`, `scripts/result_reuse_guard.py`, `tests/test_result_reuse_guard.py`, `skills/context-reuse-analysis.md`, `rules/reuse-safety.md`, `workflows/measure-optimize-verify.md`, `hooks/pre-context-append.md`.

## Installation
Python 3.10+, no third-party packages.

## Usage
`python scripts/result_reuse_guard.py --events events.jsonl --policy config/policy.json`

## Metrics
Input tokens/task, repeated bytes, reuse-hit rate, avoided bytes, compaction count, latency/task, quality regression.

## Verification
`python -m unittest discover -s tests`

## Safety
Never reuse mutating, approval-gated, secret-bearing, time-sensitive, or dependency-unknown results.

## Failure handling
On invalid or ambiguous state, send the full result. Maximum two policy revisions before escalation.

## Definition of Done
Implemented: guard/hook integrated. Measured: baseline and post-change metrics captured. Verified: tests pass, dependency changes invalidate, no required context is omitted.
