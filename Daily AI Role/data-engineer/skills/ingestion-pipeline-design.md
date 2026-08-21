# Ingestion Pipeline Design

**Purpose:** ingest source data reliably without losing provenance.

**Trigger:** new source or ingestion redesign.

**Inputs:** source API/files/CDC/stream, volumes, rate limits, ordering, authentication, SLA, contract.

**Procedure**
1. Determine extraction mode: batch, CDC, stream or event subscription.
2. Define cursor/watermark and exactly-once/idempotency strategy.
3. Preserve source identifiers, event time, ingestion time and provenance.
4. Define pagination, throttling, retries, dead-letter/quarantine and checkpointing.
5. Plan raw landing and immutable retention where appropriate.
6. Calculate expected volume, partitioning and cost envelope.
7. Define freshness, lag and error metrics.
8. Test duplicate delivery, late data, partial failure and restart.

**Parallel work:** source profiling, security review and capacity analysis may run concurrently.

**Outputs:** pipeline design, checkpoints, failure policy, monitoring and operational runbook.

**Verification:** controlled replay produces no unintended duplicates or loss.

**Stop conditions:** inaccessible source, undefined authorization, unresolved data classification or unbounded cost.
