# Context Compaction Snapshot Integrity Gate

**Category:** Token  
**Run date:** 2026-08-28 (UTC+7)

## Problem
Agent runtimes can confuse cumulative per-run token usage with the current prompt/context snapshot. When an inflated value is persisted as authoritative context size, auto-compaction fires prematurely, burns summarization tokens, churns repeatedly, and can destructively discard useful history even when the actual prompt is far below the context limit.

## Evidence
See `evidence/research.md`. August 2026 OpenClaw reports show persisted context values around 1.5M tokens when the latest real prompt was ~81k, and a separate P0 data-loss report shows compaction at only 4–8% of a configured 1M-token context window.

## Existing approach
Use last-call usage, freshness flags, transcript token estimates, compaction thresholds, and post-compaction counters.

## Existing limitations
Different execution paths may persist different usage objects; freshness flags can make wrong snapshots authoritative; provider cache accounting is easy to misinterpret; later writes can overwrite correct post-compaction metadata.

## Proposed improvement
Treat context-size persistence as a typed snapshot contract. A compaction decision must be backed by an explicit latest-call or transcript-derived context snapshot, pass drift checks against independent estimates, and never fall back silently to cumulative run usage.

## Architecture
```text
config/policy.json
schemas/session_snapshot.schema.json
scripts/compaction_snapshot_guard.py
tests/test_compaction_snapshot_guard.py
skills/context-snapshot-audit.md
rules/compaction-integrity.md
subagents/token-verifier.md
workflows/diagnose-and-verify.md
hooks/pre-compaction.md
evidence/research.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Usage
Create a session snapshot JSON matching `schemas/session_snapshot.schema.json`, then run:
`python scripts/compaction_snapshot_guard.py --input snapshot.json --policy config/policy.json`

## Metrics
Persisted/latest snapshot drift, transcript-estimate drift, false compaction rate, compactions/session, tokens discarded by compaction, summarization tokens, quality regression after compaction.

## Verification
Run `python -m unittest tests/test_compaction_snapshot_guard.py`. Integrations must also replay a known multi-tool-loop fixture where cumulative run usage greatly exceeds the latest context snapshot.

## Safety
If snapshot provenance is ambiguous, fail closed by suppressing automatic destructive compaction and surface an explicit diagnostic. Never discard history merely because cumulative usage is large.

## Failure handling
Detection: guard exit 3. Evidence: machine-readable drift reasons. Retry policy: one fresh snapshot recomputation plus one transcript estimate, then stop. Fallback: keep session intact and require manual review or a non-destructive context strategy. Escalate if context is genuinely near hard limit and no trustworthy snapshot can be produced.

## Definition of Done
**Implemented:** typed snapshot contract and pre-compaction gate integrated.  
**Measured:** false-compaction and drift metrics captured.  
**Verified:** known cumulative-usage fixtures are blocked, real high-context fixtures are allowed, tests pass, and no compaction occurs from untrusted cumulative counters.
