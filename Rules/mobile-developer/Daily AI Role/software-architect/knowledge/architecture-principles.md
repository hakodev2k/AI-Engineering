# Architecture Principles

## Architecture is a decision system
Architecture is not the diagram. It is the set of consequential decisions, constraints, boundaries, and verification mechanisms that shape system evolution.

## Prefer reversibility
When two solutions satisfy requirements similarly, prefer the one that is easier to change, migrate, operate, and roll back. Irreversible choices require stronger evidence and approval.

## Boundaries follow ownership and change
Good boundaries reduce coordination cost, contain failures, and make ownership explicit. Splitting by nouns alone can increase distributed coupling. Consider business capability, transaction boundaries, data ownership, team ownership, and change cadence together.

## Data ownership is architectural
Define the authoritative owner, lifecycle, consistency model, retention, reconciliation, access policy, and migration path. Shared mutable databases across independently deployed services increase coupling and accountability ambiguity.

## Reliability is end-to-end
A component cannot claim an SLO by itself when the user journey depends on weaker downstream systems. Model dependency availability, timeout budgets, retries, idempotency, backpressure, degradation, recovery, and operational response.

## Avoid retry amplification
Retries consume capacity during failure. Use bounded retries, exponential backoff with jitter where appropriate, idempotency, circuit breaking/load shedding when useful, and a total request deadline.

## Observability is part of design
Define what signals prove success/failure: metrics, logs, traces, business events, correlation IDs, dashboards, alerts, and ownership. Instrumentation added after incidents often misses the causal path.

## Security uses explicit trust boundaries
Authenticate identities, authorize actions, minimize privilege, validate inputs, protect data in transit/at rest as required, audit sensitive actions, and model threat paths. Security exceptions require the correct owner.

## Capacity starts with workload
Throughput, concurrency, payload size, data volume, fan-out, retention, burstiness, and growth determine bottlenecks. Benchmark representative workloads; do not extrapolate from idealized vendor claims.

## Architecture documents should enable continuation
A useful design lets another engineer understand goals, constraints, boundaries, contracts, failure modes, decisions, rollout, rollback, observability, risks, and how to verify the system.