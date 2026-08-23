# Compaction Source Rules

- Automatic compaction MUST use a point-in-time current-context token snapshot.
- The snapshot MUST carry source/provenance and freshness.
- `run_total`, billing totals, session lifetime totals, cache reads, and cache writes MUST NOT directly drive context-window pressure.
- A boolean freshness marker MUST NOT compensate for unknown or invalid provenance.
- If the snapshot is stale, missing, or semantically ambiguous, the runtime MUST recompute occupancy before deciding.
- Post-compaction metadata MUST be refreshed from the compacted state before another automatic decision.
- The runtime MUST record decision tokens, context window, threshold, source, and resulting decision.
- Regression tests MUST include multi-call turns whose cumulative usage exceeds the window while the current prompt remains below threshold.
- Automatic recomputation SHOULD be bounded to two attempts.
- The runtime MUST NOT discard additional context merely to silence an accounting inconsistency.