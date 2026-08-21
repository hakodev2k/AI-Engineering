# Workflows

## Workflow A — Measure → Diagnose → Integrate → Re-measure
**Trigger:** repeated file reads or rising context/token cost.
**Goal:** remove redundant unchanged reads without suppressing required context.
**Inputs:** representative traces/tasks, policy, file-read lifecycle.
**Baseline:** duplicate calls, bytes, estimated tokens, read latency, compaction count, quality/error rate.
**Context:** repository/worktree identity, agent ID, task generation, compaction events.

### Stages
1. **Observe — Read Trace Analyst.** Capture read calls with path/range/bytes and compaction boundaries.
2. **Baseline — Read Trace Analyst.** Fingerprint repeated content and quantify duplicate cost.
3. **Cause — Read Trace Analyst.** Separate model rereads, post-compaction read-state loss, subagent duplication and legitimate verification.
4. **Hypothesis — Cache Integrator.** Define which calls can safely become `UNCHANGED_READ` receipts.
5. **Implement — Cache Integrator.** Wire pre-read `check`, post-read `record`, mutation `invalidate`, and compaction `compact`.
6. **Measure — Independent Verifier.** Replay the same corpus and compare metrics.
7. **Better?** If duplicate bytes fall >=80% and correctness gates hold, proceed. Otherwise revise one hypothesis.
8. **Verify — Independent Verifier.** Run stale-content, range, compaction, multi-agent, and forced-read tests.

**Checkpoints:** baseline accepted; lifecycle coverage accepted; replay metrics accepted; correctness tests accepted.
**Metrics:** duplicate bytes/tokens/calls, read latency, cache hit rate, rehydrations, false cache hits, task-quality regressions.
**Retry policy:** maximum 2 optimization revisions. Each revision must name a failed metric or fixture.
**Stop conditions:** verified success; any stale substitution; missing lifecycle event; or 2 failed revisions.
**Failure path:** disable suppression, continue real reads, retain diagnostic metrics, escalate with failing fixture.
**Definition of Done:** baseline and post-change metrics exist; >=80% duplicate-byte reduction or an explicitly justified lower threshold; false cache hits=0; no quality regression; integration documented.

## Workflow B — Per-read decision
**Trigger:** every file read request.
**Goal:** choose receipt vs real read safely.
**Inputs:** path, range, `require_context`, optional force reason.
**Baseline:** current fingerprint ledger.
**Stages:** canonicalize → if forced, read → otherwise `check` → HIT: return receipt → MISS: read exact requested range → `record` → emit metrics.
**Checkpoint:** hit is valid only when fingerprint and coverage match; if exact context required, residency must also be present.
**Retry policy:** no model retry. On guard error, one deterministic fallback to real read.
**Stop conditions:** receipt returned or actual read completed.
**Failure path:** real read with `guard_degraded=true` metric.
**Verification:** mutation fixture must cause next read to miss.
**Definition of Done:** exactly one decision and no ambiguous state.

## Workflow C — Compaction recovery
**Trigger:** context compaction/summarization.
**Goal:** avoid both unsafe stale assumptions and blind rereading.
**Stages:** execute `compact` → preserve fingerprints/ranges → mark residency unknown → subsequent semantic-only checks may reuse unchanged receipt → exact-text operations use `--require-context` and rehydrate required ranges → record new residency.
**Retry policy:** maximum one rehydration per unchanged range per compaction generation unless content changes or verification is explicitly requested.
**Stop conditions:** necessary exact text is reintroduced or task can proceed from compact receipt.
**Failure path:** clear affected ledger entry and read normally.
**Definition of Done:** no infinite reread loop and no exact-text operation proceeds from unknown residency.
