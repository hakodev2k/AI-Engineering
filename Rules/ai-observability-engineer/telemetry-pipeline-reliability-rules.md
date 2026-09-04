# Telemetry Pipeline Reliability Rules

## Purpose
Ensure the observability system itself remains measurable, bounded, and trustworthy during production stress.

## Scope
Applies to collectors, agents, exporters, queues, processors, storage backends, and ingestion APIs.

## MUST
- Telemetry pipelines MUST expose their own throughput, drop rate, queue depth, export failures, processing latency, and storage errors.
- Buffering MUST be bounded and have defined overflow behavior.
- Critical telemetry-loss conditions MUST be detectable independently of the affected application signal when possible.
- Backpressure behavior MUST be tested under load and dependency outage.
- Data freshness and ingestion lag MUST be measurable for dashboards and alerts that depend on near-real-time evidence.

## MUST NOT
- Telemetry backpressure MUST NOT cause uncontrolled memory growth or cascading failure in serving workloads.
- Missing telemetry MUST NOT be interpreted as zero activity or healthy state.
- Pipeline retries MUST NOT create unbounded duplicate events without deduplication or idempotent processing strategy.

## SHOULD
- Prioritize critical reliability and security telemetry during overload.
- Maintain capacity headroom based on tested peak volume rather than average load alone.

## Exceptions
Intentional lossy sampling is allowed only when documented, measurable, and consistent with diagnostic requirements.

## Verification
Run load, outage, queue-saturation, storage-failure, and recovery tests. Inspect drop counters, lag metrics, memory behavior, and dashboard freshness indicators.