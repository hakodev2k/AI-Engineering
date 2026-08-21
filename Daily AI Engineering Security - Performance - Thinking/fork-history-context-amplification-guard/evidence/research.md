# Research Evidence

## Topic
Fork History Context Amplification Guard

## Category
Token

## Problem
Full-history forks and long multimodal sessions can re-materialize superseded compaction snapshots and repeated inline image payloads. This amplifies persisted bytes and request context, increases retry/transport failure risk, and can multiply cost across subagents.

## Why it matters now
On 2026-08-19, Codex issue #39499 reported a ~468 MB fork with 20 historical compaction records replayed rapidly, nine records above 20 MB, and repeated inline image data. Earlier issue #34268 measured ~110 GiB of session storage across a multi-agent tree, with a representative child 97.6% composed of compacted records. Issue #24550 reproduced WebSocket fallback from compacted inline images and removed the failure by sanitizing only those retained images.

## Affected users
Developers using long-running multimodal agents, full-history forks, proactive multi-agent workflows, desktop/CLI session persistence, and platforms that persist compacted context inline.

## Current public evidence
### Observed evidence
- openai/codex#39499: affected full-history fork ~468 MB/~12k records; latest compacted replacement history ~26.3 MB; repeated inline image payloads; WebSocket closes before `response.completed` while unrelated large threads work.
- openai/codex#34268: ~110.09 GiB across 300 rollout files; 294 subagent rollouts accounted for ~106.56 GiB; representative child was ~1.7 GB and 97.6% compacted records.
- openai/codex#24550: ~703 MB session with ~17.4 MB largest compacted line; removing only compacted `input_image` payloads reduced size to ~195 MB and eliminated 5 WebSocket retries/fallback in the reproduction.

### Interpretation
The evidence supports a context-amplification failure mode: append-only historical compactions and inline blobs are repeatedly retained or copied across forks even when later compactions supersede earlier model-visible history. Transport failures are correlated with this shape, but exact service payload limits are not inferred.

### Proposed solution
Add a read-only preflight/audit layer that measures compaction duplication, repeated inline blobs, oversized records, and projected fork payload before a full-history fork. Use explicit budgets and fail closed or choose a narrower history mode when thresholds are exceeded. Preserve correctness by never dropping the latest effective context or unique required artifacts without verification.

## Existing approaches
Compaction reduces active model context; full-history fork preserves history; image resizing/compression can reduce individual blobs; retries/fallback recover some transport failures.

## Remaining limitations
Compaction can itself persist large replacement histories, old compactions remain in append-only rollouts, full-history fork can copy all historical compactions, inline images can be duplicated, and retry/fallback treats the symptom after an oversized/amplified request already exists.

## Root-cause analysis
1. Persistence history and effective model history are not equivalent.
2. Superseded compaction snapshots may remain eligible for full-history inheritance.
3. Large inline blobs are content-duplicated rather than content-addressed.
4. Fork creation lacks an explicit byte/token amplification preflight.
5. Retry loops can repeat the same pathological payload.

## Improvement opportunity
Measure effective versus persisted history, hash inline blobs, identify superseded compactions, enforce configurable byte/blob/record budgets, and require before/after verification of context coverage.

## Relevant sources
- https://github.com/openai/codex/issues/39499
- https://github.com/openai/codex/issues/34268
- https://github.com/openai/codex/issues/24550
