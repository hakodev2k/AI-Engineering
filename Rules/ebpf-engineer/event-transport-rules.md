# Event Transport

## Purpose
Deliver kernel events to userspace with known loss, ordering, and backpressure semantics.

## Scope
Ring buffers, perf buffers, event schemas, sampling, batching, loss counters, and consumers.

## MUST
- Event transport MUST define acceptable loss, ordering, latency, and throughput characteristics.
- Event schemas MUST be compatibility-controlled across producer and consumer versions.
- Dropped/reservation-failed events MUST be measured when loss affects conclusions.
- Consumers MUST handle malformed, unknown, and version-skewed events safely.
- Backpressure behavior MUST be explicit under overload.

## MUST NOT
- MUST NOT claim complete observation when transport loss is unknown.
- MUST NOT emit sensitive kernel/process data without a defined data policy.
- MUST NOT let diagnostic traffic exhaust host resources.

## SHOULD
- Prefer ring buffers where their semantics and target support fit.
- Batch or sample high-volume events based on measured workload.

## Exceptions
Exceptions require documented accuracy impact, safeguards, metrics, and expiry or review criteria.

## Verification
Stress producer/consumer paths, measure loss and latency, test schema skew, and inspect overload behavior and resource consumption.