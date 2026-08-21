# MCP Capability Refresh Consistency Guard

**Category:** Performance  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Dynamic MCP servers can change their tool catalog while a client session remains alive. Current client reports show stale `tools/list` data surviving catalog changes or reconnects, leaving the transport apparently healthy while the model sees missing or outdated tools and schemas. The result is failed calls, repeated reconnects, full-session restarts, and unnecessary context reload cost.

## Evidence
See `evidence/research.md`. The package uses current Claude Code reports plus the MCP 2026-07-28 Tools specification, which explicitly defines mutable tool sets, `listChanged`, subscriptions, `tools/list`, TTL, and cache scope.

## Existing approach
Manual reconnect/restart, TTL caches, server renaming, or a static meta-tool can restore access in some cases.

## Existing limitations
Those approaches are reactive or coarse. A transport reconnect does not prove that the model-visible catalog was refreshed, server names are weak cache identities, and a full restart imposes latency/context reload overhead.

## Proposed improvement
Treat capability freshness as a measurable state separate from transport health. Normalize and fingerprint tool catalogs, invalidate freshness on change/reconnect/auth-scope/deployment events, fetch the complete authoritative catalog, compare it with the client-visible catalog, and block changed-tool dispatch while a mismatch remains.

## Architecture
- `skills/catalog-consistency-analysis.md` defines evidence-driven diagnosis.
- `rules/capability-freshness-rules.md` defines enforceable invariants.
- `subagents/capability-verifier.md` provides independent verification.
- `workflows/refresh-and-verify.md` defines the bounded recovery loop.
- `hooks/pre-tool-capability-gate.md` blocks stale dispatch.
- `scripts/catalog_fingerprint.py` provides deterministic catalog comparison.
- `tests/test_catalog_fingerprint.py` verifies core fingerprint behavior.

## Package tree
```text
README.md
evidence/research.md
skills/catalog-consistency-analysis.md
rules/capability-freshness-rules.md
subagents/capability-verifier.md
workflows/refresh-and-verify.md
hooks/pre-tool-capability-gate.md
scripts/catalog_fingerprint.py
tests/test_catalog_fingerprint.py
```

## Installation
Python 3.9+ is sufficient; no third-party packages are required. Copy the package into the host agent repository and connect the pre-tool gate to the MCP discovery/dispatch layer.

## Configuration
The host must provide two sanitized JSON snapshots when verification is possible: the authoritative server catalog and the client/model-visible catalog. Authentication should be represented only by non-secret scope/identity metadata, never raw tokens.

## Usage
```bash
python3 scripts/catalog_fingerprint.py authoritative-tools.json
python3 scripts/catalog_fingerprint.py authoritative-tools.json --compare visible-tools.json
python3 -m unittest tests/test_catalog_fingerprint.py
```

Exit codes: `0` = valid/match, `2` = invalid input, `3` = semantic mismatch.

## Workflow
Follow `workflows/refresh-and-verify.md`: Observe → measure baseline → diagnose → hypothesize → refresh → measure again → independently verify → complete. Network recovery is limited to two attempts.

## Metrics
Measure refresh latency p50/p95, stale tool-call failures, full-session restart count, mismatch duration, cache hit rate, task completion latency, and recovery token/time overhead.

## Verification
A semantic schema/tool change must alter the catalog fingerprint; ordering-only changes must not. After refresh, authoritative and client-visible fingerprints must match and a representative task must complete without the previous stale-tool failure. The Capability Verifier, not the implementation path alone, must issue PASS.

## Safety
Freshness checks are read-only. Never use a mutating tool as a probe, never log credentials, and never bypass tool approvals merely to recover performance.

## Failure handling
Detection is a fingerprint mismatch, stale-tool error, or freshness trigger without a verified refresh. Evidence is the normalized comparison and host metrics. Retry at most twice for transient transport failure. On repeated failure, mark the catalog stale/unknown, preserve the last known snapshot, block affected tool dispatch, and escalate rather than loop.

## Implemented / Measured / Verified
**Implemented** means the gate and refresh integration exist. **Measured** means baseline and after metrics were captured on the same scenario. **Verified** means semantic fixtures pass, catalogs agree after refresh, and the independent verifier returns PASS.

## Definition of Done
Current evidence documented; baseline captured; root cause classified; refresh path integrated; fingerprint tests pass; before/after metrics exist; authoritative and visible catalogs agree; representative task succeeds without full restart; security/approval boundaries are unchanged; no blocking mismatch remains; independent verification passes.

## Customization
Extend normalization only for metadata proven non-semantic in your environment. If the host exposes a catalog generation/version, include it in refresh telemetry but retain content fingerprints so version-label mistakes cannot hide schema drift.