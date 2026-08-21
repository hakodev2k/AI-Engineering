# Dynamic Tool Prefix Cache Stability Guard

**Category:** Token

## Problem
Dynamic MCP/tool discovery can mutate cache-sensitive prompt prefixes through reordering, reserialization, or full system-prompt rebuilds. This raises cold input tokens and latency even when the logical catalog is unchanged.

## Evidence
See `evidence/research.md`. Current signals include MCP 2026-07-28 cacheability changes, Claude Code #75142, Qwen Code #4777, VS Code Cache Explorer guidance, and MCP schema-overhead discussion #2808.

## Existing approach
Provider prompt caching, lazy/deferred tools, MCP list caching, and manual cache debugging.

## Existing limitations
Equivalent catalogs may still produce different bytes; deferred loading can invalidate an established prefix; and telemetry often cannot attribute cache loss to a specific tool revision.

## Proposed improvement
Canonicalize tool catalogs, fingerprint semantic and raw representations, correlate catalog revisions with cache telemetry, and block verification when semantically equivalent catalogs drift unnecessarily.

## Architecture
- `evidence/research.md` — current problem evidence and root-cause analysis.
- `config/policy.json` — measurable thresholds and invariants.
- `skills/cache-stability-investigation.md` — reusable investigation procedure.
- `rules/cache-stability.md` — enforceable cache/token rules.
- `subagents/cache-investigator.md` — scoped diagnostic role.
- `workflows/measure-optimize-verify.md` — bounded before/after workflow.
- `hooks/pre-model-cache-budget.md` — deterministic pre-request check.
- `scripts/cache_prefix_audit.py` — canonical fingerprint/drift detector.
- `tests/test_cache_prefix_audit.py` — deterministic regression tests.

## Installation
Requires Python 3.10+. Tests use `pytest`. No runtime secrets are required.

## Configuration
Adjust `config/policy.json` to fit provider economics and workload quality tolerance. Do not weaken correctness/security context to meet token targets.

## Usage
Run:
`python scripts/cache_prefix_audit.py current-tools.json --previous previous-tools.json --policy config/policy.json`

Exit codes: 0 stable/semantic change, 2 invalid input, 3 avoidable byte/order drift.

## Workflow
Observe → measure baseline → diagnose semantic vs byte drift → form one hypothesis → stabilize → replay workload → verify cache/token and quality metrics. Maximum two failed hypotheses.

## Metrics
Prompt-cache hit ratio, cold input tokens/task, prefix mutations/session, p50/p95 request latency, tool-selection success, and quality regression rate.

## Verification
Run `pytest tests/test_cache_prefix_audit.py`, then execute the representative workload before and after the runtime change. Provider cache telemetry is preferred over latency inference.

## Safety
Required tools, permission boundaries, security instructions, and correctness context must remain available. Cache optimization is subordinate to correctness and security.

## Failure handling
On deterministic drift, block verification and identify serialization/order source. On quality regression, revert. If provider cache semantics cannot be observed, mark measurement inconclusive rather than claiming a win.

## Definition of Done
**Implemented:** deterministic serialization/fingerprint integration exists. **Measured:** reproducible baseline and post-change cache/token/latency metrics exist. **Verified:** semantically equivalent catalogs are byte-stable, cache metrics improve or remain within policy, tool-selection quality passes, and no required context was removed.

## Customization
Extend the canonicalizer for provider-specific schema fields, add request-prefix snapshots, or connect telemetry exporters. Preserve the semantic-vs-byte distinction and bounded workflow.
