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
A deterministic pre-resume hook calls the prefix guard; the guard emits hashes and exposure rather than raw prompt content; workflow/rules define measured optimization; an independent verifier checks equivalent workload quality.

## Actual package tree
```text
prompt-cache-prefix-drift-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-resume.md
├── rules/cache-stability.md
├── scripts/prefix_drift_guard.py
├── skills/cache-prefix-analysis.md
├── subagents/cache-verifier.md
├── tests/test_prefix_drift_guard.py
└── workflows/measure-diagnose-optimize.md
```

## Installation
Python 3.10+. No third-party packages.

## Usage
`python scripts/prefix_drift_guard.py --before baseline.json --after candidate.json`

Each JSON file contains ordered prompt blocks and an `estimated_input_tokens` field.

## Workflow
Measure baseline → fingerprint and diagnose first divergence → form one hypothesis → make the smallest safe layout/version-pinning change → measure the same workload again → independently verify. Maximum 2 optimization attempts.

## Metrics
Cache-read ratio, cache-creation tokens, drift index, estimated recache tokens, tokens/task, cost/task, latency, and task-quality regression.

## Verification
Run `python -m unittest tests/test_prefix_drift_guard.py`. A verified change must block a synthetic cache-break before spend and preserve required task/security context.

## Safety
Never log raw secrets. Fingerprints are SHA-256 hashes. The guard MUST NOT remove security or correctness context merely to preserve caching.

## Failure handling
Detection uses a non-zero exit code. Maximum optimization retries: 2. Fallback: start a fresh session or obtain explicit approval. Stop on unexplained prefix drift or quality/security regression.

## Definition of Done
**Implemented:** guard integrated before resume.  
**Measured:** before/after cache metrics captured on an equivalent workload.  
**Verified:** regression tests pass, cache-break fixture is blocked before spend, and independent review confirms no critical context loss.

## Customization
Provider-specific token/cost thresholds may be added, but provenance, hashing, secret handling, and correctness/security constraints MUST remain strict.
