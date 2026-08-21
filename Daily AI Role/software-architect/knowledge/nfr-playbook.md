# NFR Playbook

Use this as an elicitation and verification guide, not an automatic checklist for every system.

## Availability and reliability
Ask: Which user journeys are critical? Target availability? Dependency budget? Graceful degradation? Error budget?  
Evidence: SLO dashboards, dependency SLAs, failure tests.  
Common mistake: assigning 99.99% to every component without cost or end-to-end math.

## Performance
Ask: p50/p95/p99 latency, peak throughput, concurrency, payload sizes, query complexity, warm/cold behavior.  
Evidence: representative load tests and production telemetry.  
Trade-off: caching/denormalization can reduce latency but increase consistency and invalidation complexity.

## Scalability
Ask: expected growth, burstiness, tenant skew, partition key, stateful bottlenecks, scaling time.  
Evidence: capacity model plus saturation tests.  
Common mistake: “horizontal scaling” without checking database, queue, lock, or downstream limits.

## Recoverability
Ask: RTO, RPO, backup frequency, restore time, failover ownership, data reconciliation, regional dependency.  
Evidence: restore/failover rehearsal.  
Common mistake: backup exists but restore is untested.

## Security/privacy
Ask: identities, authorization model, trust boundaries, sensitive data, retention, audit, secret handling, threat actors.  
Evidence: threat model, control configuration, review.  
Common mistake: equating authentication with authorization.

## Maintainability and deployability
Ask: ownership, module boundaries, testability, compatibility, deployment frequency, feature flags, migration strategy, rollback.  
Evidence: change lead time, failed-deployment rate, dependency graph.  
Trade-off: extra abstraction can increase flexibility but also cognitive load.

## Observability
Ask: how will operators detect user impact, locate failure, correlate requests, and know recovery succeeded?  
Evidence: dashboards, alerts, trace/log examples, runbooks.

## Cost
Ask: steady vs burst cost, major unit cost drivers, egress/storage/retention, support/ops effort, scaling curve, committed spend.  
Evidence: cost model and sensitivity analysis.  
Common mistake: comparing service list price without operational labor and failure cost.

## Compatibility
Ask: external consumers, versioning, schema evolution, event compatibility, deprecation window.  
Evidence: contract tests and consumer inventory.

## Quantification pattern
Replace “fast/reliable/scalable” with measurable statements such as: “p95 < 300 ms at 500 requests/s for payloads <= 64 KB, excluding third-party latency, measured over 15 minutes.” State the measurement boundary explicitly.