# Hook Context Canonicalization Cache Guard

**Category:** Token

## Problem
Tool-hook context can be semantically unchanged yet serialize differently when an agent host rebuilds history. That byte drift can break provider prompt-prefix reuse and force large cache writes.

## Evidence
See `evidence/research.md`. Current reports isolate PreToolUse/PostToolUse `additionalContext` serialization drift and show large real-world cache rewrites.

## Existing approach and limitations
Disabling hooks avoids the symptom but removes policy/observability value. Provider caching cannot compensate for client-side prefix mutation, and aggregate token dashboards do not identify the invalidation boundary.

## Proposed improvement
Measure cache rewrites from request-level usage, define stable-prefix serialization as an explicit contract, canonicalize reusable hook payloads, keep volatile fields out of stable blocks, and verify token savings against unchanged quality fixtures.

## Architecture
```text
hook-context-canonicalization-cache-guard/
├── README.md
├── evidence/research.md
├── config/cache-policy.json
├── skills/cache-stability-analysis.md
├── rules/prompt-cache-stability.md
├── subagents/cache-investigator.md
├── workflows/measure-diagnose-verify.md
├── hooks/cache-regression-gate.md
└── scripts/cache_trace_analyzer.py
```

## Installation
Python 3.10+ is sufficient for the analyzer; it has no third-party dependencies. Copy the package intact and adapt the usage-field extraction to your provider/runtime.

## Configuration
Edit `config/cache-policy.json` for the minimum reusable-prefix size and allowed rewrite thresholds. Thresholds are regression gates, not universal provider guarantees.

## Usage
Create chronological JSONL records such as:

```json
{"request_id":"r1","cache_read_tokens":20000,"cache_creation_tokens":200}
{"request_id":"r2","cache_read_tokens":1000,"cache_creation_tokens":19200}
```

Run:

`python scripts/cache_trace_analyzer.py trace.jsonl --policy config/cache-policy.json`

Exit 0 means the trace passes configured thresholds; 4 means a regression; 2 means invalid evidence.

## Workflow
Follow `workflows/measure-diagnose-verify.md`: Observe → baseline → diagnose → hypothesize → canonicalize → measure again → independently verify. Maximum three repair cycles.

## Metrics
Cache-creation tokens/task, cache-read tokens/task, rewrite ratio, total tokens/task, latency/task, cost/task, and quality regression rate.

## Verification
A change is **Implemented** when canonical serialization is deployed, **Measured** when comparable before/after traces exist, and **Verified** only when three repeated candidate traces pass thresholds and quality fixtures remain unchanged.

## Safety
Never remove security instructions, authorization state, evidence, or task context merely to save tokens. Prefer hashes/structural metadata over persisting raw prompts containing secrets.

## Failure handling
If the cause cannot be isolated after three evidence-backed iterations, restore original semantics, keep the diagnostic evidence, and classify the result as not verified.

## Definition of Done
Evidence documented; baseline captured; alternate causes considered; improvement implemented; analyzer passes; before/after metrics recorded; quality checks pass; no required context is lost; verification is independent; no blocking issue remains.

## Customization
Add provider-specific trace adapters without changing the core invariant: semantically reusable prefix material should have deterministic representation, and optimization must preserve correctness.
