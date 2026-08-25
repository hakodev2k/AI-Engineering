# MCP Skill Lazy Materialization Budget Guard

**Category:** Performance

## Problem
Large remote skill catalogs can turn connection/startup into an eager request fan-out. Fetching every skill and every supporting resource wastes bandwidth, increases server load, and delays tasks that use only a small subset.

## Evidence
See `evidence/research.md`. August 2026 MCP maintainer notes explicitly identify server strain from clients downloading around 150 skills one resource request at a time; the Skills-over-MCP WG is concurrently defining size/file-count guidance and caching semantics.

## Existing approach
The extension provides `skills/list`, `skills/get`, per-file digests, optional directory enumeration, cache hints, and progressive-disclosure concepts.

## Existing limitations
Cache TTL does not prevent cold-start fan-out, per-skill size limits do not cap total connection work, and there is not yet a universal reference-client materialization policy.

## Proposed improvement
Separate discovery from materialization. Produce a deterministic, task-aware fetch plan bounded by request count, bytes, and concurrency; reuse matching digests and deduplicate resources.

## Architecture
```text
evidence/research.md
rules/materialization-performance.md
skills/measure-skill-materialization.md
subagents/materialization-verifier.md
workflows/measure-diagnose-materialize.md
hooks/materialization-budget-check.md
config/default-budget.json
scripts/skill_materialization_planner.py
tests/test_skill_materialization_planner.py
README.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/default-budget.json` for your server/client limits. Start conservatively and derive production budgets from representative traces.

## Usage
`python scripts/skill_materialization_planner.py --catalog catalog.json --config config/default-budget.json --output plan.json`

Each catalog skill may specify `id`, `relevance`, `required`, and `resources`. A resource can include `uri`, `digest`, `cached_digest`, and `size`.

## Workflow
Use `workflows/measure-diagnose-materialize.md`: baseline first, diagnose, hypothesize, optimize, re-measure, then independent verification.

## Metrics
Requests/task, bytes/task, p50/p95 latency, cache-hit ratio, concurrency, server errors, selected-skill precision/recall, and task regression rate.

## Verification
Run `python -m unittest tests/test_skill_materialization_planner.py` and benchmark the same representative workload before and after integration. Do not claim improvement from planner unit tests alone.

## Safety
Optimization must not bypass skill provenance, permission, digest, or integrity validation. A required skill that cannot fit the budget must produce explicit budget exhaustion, not silent omission.

## Failure handling
Detect via nonzero planner exit, benchmark regression, required-skill miss, or increased server error rate. Retry at most two optimization hypotheses. Revert/disable speculative prefetch if performance or correctness regresses.

## Definition of Done
**Implemented:** bounded lazy planner integrated with fetch dispatch. **Measured:** cold/warm baseline and after metrics captured under equivalent workload. **Verified:** reproducible reduction in at least one target performance metric, no required-skill loss, no security regression, tests pass, independent verifier approves.

## Customization
Replace the simple relevance score with your own selector, but retain finite budgets, required-skill protection, digest reuse, deduplication, and measurement gates.
