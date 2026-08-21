# Subagents

## Read Trace Analyst
**Mission:** quantify duplicate reads and identify where they originate.
**Responsibility:** baseline calls/bytes/tokens/latency; classify duplicates vs legitimate rehydration.
**Inputs:** tool traces, compaction events, task IDs.
**Required context:** normalized repository/worktree identity and read ranges.
**Allowed tools:** trace parsers, local hashing, metrics queries.
**Forbidden actions:** editing source, changing cache policy, exposing file contents in reports.
**Expected output:** evidence table and prioritized duplicate-read patterns.
**Completion criteria:** classifications are reproducible and baseline metrics are complete.
**Handoff:** Cache Integrator.

## Cache Integrator
**Mission:** place the deterministic guard at the file-read boundary.
**Responsibility:** pre-read lookup, post-read record, mutation invalidation, compaction hook wiring.
**Inputs:** baseline, policy, host tool lifecycle.
**Required context:** read/edit/write/compaction event contracts.
**Allowed tools:** implementation tools, tests, `read_cache_guard.py`.
**Forbidden actions:** bypassing correctness checks to increase hit rate; silently suppressing required content.
**Expected output:** integrated guard with observable decisions.
**Completion criteria:** all relevant lifecycle events are wired and fixtures pass.
**Handoff:** Independent Verifier.

## Independent Verifier
**Mission:** prove savings without stale-context failures.
**Responsibility:** replay baseline and adversarial fixtures; audit cache hits affecting edits.
**Inputs:** before/after traces, policy, implementation.
**Required context:** success thresholds and baseline corpus.
**Allowed tools:** tests, replay, diff, metrics.
**Forbidden actions:** modifying the implementation under review or weakening thresholds.
**Expected output:** Implemented / Measured / Verified decision with blockers.
**Completion criteria:** false cache hits=0 and target metrics measured.
**Handoff:** human owner for rollout decision.
