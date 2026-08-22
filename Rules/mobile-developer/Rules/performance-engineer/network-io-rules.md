# Network and I/O Rules
## Purpose
Control network, storage, and serialization costs on critical paths.
## Scope
HTTP/RPC, sockets, files, object storage, serialization, compression, and payloads.
## MUST
- Measure payload size, round trips, bandwidth, I/O latency, and serialization cost when relevant.
- Reuse connections safely and configure timeouts explicitly.
- Validate compression and batching with end-to-end measurements.
## MUST NOT
- Add chatty remote calls to hot paths without latency and failure analysis.
- Assume compression is beneficial for all payload sizes or CPU budgets.
## SHOULD
- Reduce unnecessary transfers and redundant serialization.
## Exceptions
Protocol constraints may require extra round trips with documented impact.
## Verification
Use traces, network metrics, payload inspection, I/O profiles, and benchmark comparisons.