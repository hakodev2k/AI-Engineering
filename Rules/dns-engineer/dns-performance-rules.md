# DNS Performance Rules

## Purpose
Protect DNS latency, throughput, and capacity using evidence.

## Scope
Authoritative servers, resolvers, network paths, and DNS-dependent applications.

## MUST
- Performance claims MUST be supported by before/after measurements under representative load.
- Capacity planning MUST consider query rate, cache-miss rate, response size, DNSSEC overhead, and failure scenarios.
- Latency analysis MUST separate resolver, authoritative, network, and application effects where possible.

## MUST NOT
- MUST NOT optimize DNS based only on anecdotal latency.
- MUST NOT reduce resilience solely to improve benchmark results.

## SHOULD
- Load tests SHOULD include realistic record distributions and cache states.

## Exceptions
Synthetic-only evidence requires a documented limitation and production validation plan.

## Verification
Review benchmarks, percentile latency, QPS, saturation, cache metrics, packet evidence, and failure-load tests.