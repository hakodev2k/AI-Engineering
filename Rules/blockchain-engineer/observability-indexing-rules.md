# Observability and Indexing

## Purpose
Make on-chain behavior diagnosable without confusing derived indexes with canonical state.

## Scope
Events, indexers, RPC reads, dashboards, alerts, reconciliation, and operational telemetry.

## MUST
- Emit sufficient events for material state transitions that operators and integrators must observe.
- Treat chain state as authoritative when an index can lag, fork, or rebuild.
- Design indexers to handle duplicate events and reorganizations.
- Monitor privileged actions, abnormal asset movements, failed transactions, and critical invariant signals.
- Correlate off-chain records with chain, block, transaction, and log identifiers.

## MUST NOT
- Use an indexer as the sole source of truth for safety-critical authorization or settlement.
- Log private keys, seed phrases, raw secrets, or sensitive signing material.
- Alert on noisy symptoms without actionable context.

## SHOULD
- Provide reconciliation jobs and lag/freshness metrics.

## Exceptions
Event omissions require an alternative deterministic observation method and documented integration impact.

## Verification
Rebuild indexes from chain history, simulate reorgs, inspect event schemas, compare indexed/canonical state, and review alert evidence.