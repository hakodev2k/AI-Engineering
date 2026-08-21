# Data Pipeline Health Metrics

Track only metrics that influence decisions:
- Freshness/lag by dataset and consumer SLA.
- Completeness: expected vs received partitions/records where a denominator exists.
- Quality rule pass/fail and affected rows.
- Duplicate-key and invalid-record rate.
- Source-to-target reconciliation variance.
- Pipeline success plus retry count and recovery time.
- Backlog/watermark delay for streams/CDC.
- Processing duration, throughput and resource cost.
- Schema-drift events and unresolved contract violations.
- Mean time to detect and restore trustworthy data.

Avoid treating volume changes alone as defects; compare against known business context and historical evidence.
