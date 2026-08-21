# Unchanged Read-Only Tool Result Dedup Guard

## Topic
Unchanged Read-Only Tool Result Dedup Guard

## Category
Token

## Problem
Long-running agents frequently resend unchanged read-only tool outputs to the model. Repeated repository reads, listings, diagnostics, and metadata can consume context and input tokens without adding information, causing earlier compaction and extra latency/cost.

## Evidence
Current signals are documented in `evidence/research.md`, including Docker Agent #3939 (2026-08-07) and Hermes Agent reports on repeated successful calls and context bloat.

## Existing approach
Typical runtimes truncate individual results, compact history, cap steps, or warn on repeated calls.

## Existing limitations
Those mechanisms are reactive or call-oriented. They do not safely prove that a repeated resource is unchanged, and blind suppression risks hiding a real update.

## Proposed improvement
Introduce a content-addressed ledger for explicitly read-only tools. Full results are hashed and bound to canonical resource identity plus freshness evidence. A later result may become a compact unchanged reference only when digest and freshness evidence both match.

## Architecture
- `evidence/research.md`
- `skills/safe-readonly-result-dedup.md`
- `rules/result-dedup-safety.md`
- `subagents/context-efficiency-analyst.md`
- `workflows/measure-deduplicate-verify.md`
- `hooks/pre-context-result-dedup.md`
- `scripts/result_dedup_guard.py`

## Installation
Requires Python 3.9+ and the standard library only.

## Configuration
Classify tools outside the script as read-only or not. Supply a canonical `resource_id` and authoritative freshness object such as ETag, git blob SHA, API version, or mtime+size where appropriate.

## Usage
```bash
python3 scripts/result_dedup_guard.py --ledger .dedup-ledger.json --input result.json --write-ledger
```

Integrations MUST append full payload for `full`/`bypass`. For `unchanged_reference`, append only the emitted reference envelope.

## Workflow
Follow `workflows/measure-deduplicate-verify.md`: observe, baseline, diagnose, hypothesize, enable observe-only decisions, implement suppression for proven-safe tools, measure again, verify changed/volatile fixtures, then independently review.

## Metrics
Input tokens/task, duplicate bytes avoided, context utilization, compactions/task, eligible hit rate, false-dedup count, task pass rate, latency.

## Verification
Verified only when changed resources always produce full results, ambiguous freshness never suppresses content, exact-byte tasks bypass optimization, and representative task quality does not regress.

## Safety
Correctness dominates token savings. Side-effecting tools are never eligible. Unknown freshness emits full content. Prefer retaining digests/metadata rather than raw secret-bearing payloads.

## Failure handling
Detection: malformed input, unavailable freshness, digest mismatch, regression failure. Retry: maximum 2 implementation iterations. Fallback: disable suppression and preserve observe-only telemetry. Escalation: human/runtime owner. Stop on any false dedup or unresolved quality regression.

## Definition of Done
- **Implemented:** guard integrated at the pre-context boundary.
- **Measured:** before/after token/context metrics collected on identical workload.
- **Verified:** zero false dedup in regression fixtures and no task-quality regression.

## Customization
Extend freshness kinds and resource canonicalization per tool while retaining fail-open-to-full-content behavior.