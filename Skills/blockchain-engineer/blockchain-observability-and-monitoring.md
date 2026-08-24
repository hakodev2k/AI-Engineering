# Blockchain Observability and Monitoring

## Purpose
Design telemetry that exposes contract, transaction, RPC, indexing, asset, and governance health early enough to support safe operations.

## When to use
Use before production launch or when improving operational visibility for live blockchain systems.

## Inputs
Critical user flows, contracts, services, RPC providers, indexers, asset balances, governance actions, SLOs, incident history.

## Preconditions
Critical invariants and failure modes are known well enough to define actionable signals.

## Context to inspect
Contract events, transaction status metrics, block lag, RPC latency/errors, indexer checkpoints, wallet balances, oracle freshness, privileged events, bridge queues, and application logs.

## Core knowledge
Blockchain systems fail across on-chain and off-chain layers. Effective monitoring correlates chain state with application state and avoids treating expected network variability as incidents.

## Procedure
1. Identify critical invariants and user journeys.
2. Define metrics for transaction submission, inclusion, revert, and finality latency.
3. Monitor RPC provider error rate, latency, and block-height divergence.
4. Track indexer lag and reorg recovery.
5. Alert on oracle staleness and abnormal price divergence where applicable.
6. Monitor privileged operations, upgrades, pauses, ownership changes, and large asset movements.
7. Track hot-wallet balances and nonce health without exposing secrets.
8. Build dashboards by chain and subsystem.
9. Make alerts actionable with runbook links and severity thresholds.
10. Test alerts using controlled failure scenarios.

## Decision points
Page only on conditions requiring immediate human action; route noisy economic/network anomalies to investigation dashboards unless they threaten invariants.

## Common failure patterns
Monitoring only backend uptime, no chain-finality context, alerting on every revert, missing admin-event alerts, and dashboards without ownership/runbooks.

## Verification
Trigger representative synthetic failures and confirm telemetry, alerts, ownership, and recovery evidence appear as designed.

## Expected output
Monitoring specification, dashboards, actionable alerts, runbook mappings, and tested detection coverage.

## Stop conditions
Escalate when critical asset-loss or governance failure modes remain undetectable with available telemetry.