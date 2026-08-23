# Telemetry Pipeline Reliability Rules
## Purpose
Keep observability trustworthy during the failures when it is most needed.
## Scope
Agents, collectors, queues, exporters, gateways, and storage ingestion.
## MUST
- Monitor telemetry pipeline availability, drops, queue depth, retries, and export failures.
- Define backpressure and buffering behavior.
- Separate telemetry failure from application failure where architecture permits.
## MUST NOT
- Allow telemetry emission to block critical application paths indefinitely.
- Hide dropped data without a measurable signal.
## SHOULD
- Provide redundant collection paths for critical environments when justified by risk.
## Exceptions
Edge/resource-constrained systems may accept bounded loss with documented behavior.
## Verification
Run collector/export failure tests and inspect drop counters, queues, recovery, and application impact.