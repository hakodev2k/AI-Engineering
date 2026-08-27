# Prompt Cache Prefix Drift Guard

**Category:** Token

## Problem
Long-running AI coding sessions can silently lose prompt-cache reuse when early prefix blocks change across resume, client updates, repository-state injection, or tool-schema changes. A tiny user turn may then recreate hundreds of thousands of cached tokens.

## Evidence
See `evidence/research.md`.

## Existing approach
Provider prompt caching, session resume, cache telemetry, and ad-hoc cache diagnosis reduce repeated input cost but usually react after the request is sent.

## Existing limitations
Cache keys depend on exact prefix stability. Dynamic system/tool content early in the prompt can invalidate all later cached tokens. Most clients do not enforce a pre-send cost guard.

## Proposed improvement
Fingerprint ordered prefix blocks, compare the rebuilt prefix before resume, estimate recache exposure, and fail closed or require approval when drift exceeds policy.

## Architecture
- `scripts/prefix_drift_guard.py` — deterministic preflight
- `tests/test_prefix_drift_guard.py` — regression tests
- `skills/cache-prefix-analysis.md` — reusable diagnosis
- `rules/cache-stability.md` — enforceable controls
- `subagents/cache-verifier.md` — independent verification
- `workflows/measure-diagnose-optimize.md` — bounded optimization
- `hooks/pre-resume.md` — blocking integration point
- `evidence/research.md` — current public evidence

## Installation
Python 3.10+. No third-party packages.

## Usage
`python scripts/prefix_drift_guard.py --before baseline.json --after candidate.json`

Each JSON file contains ordered prompt blocks and an `estimated_input_tokens` field.

## Metrics
Cache-read ratio, cache-creation tokens, drift index, estimated recache tokens, tokens/task, cost/task, latency.

## Verification
Run `python -m unittest tests/test_prefix_drift_guard.py`.

## Safety
Never log raw secrets. Fingerprints are SHA-256 hashes. The guard MUST NOT remove security or correctness context merely to preserve caching.

## Failure handling
Detection uses a non-zero exit code. Maximum optimization retries: 2. Fallback: start a fresh session or obtain explicit approval. Stop on unexplained prefix drift or quality/security regression.

## Definition of Done
**Implemented:** guard integrated before resume. **Measured:** before/after cache metrics captured. **Verified:** regression tests pass and a cache-break fixture is blocked before spend.
