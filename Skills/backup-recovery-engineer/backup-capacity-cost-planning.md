# Backup Capacity and Cost Planning

## Purpose
Forecast backup storage, throughput, and retrieval cost so protection remains sustainable and recovery performance is not constrained by under-provisioning.

## When to use
Use for platform sizing, budget planning, retention changes, rapid data growth, or repository saturation.

## Inputs
Protected size, daily change rate, retention, compression/deduplication ratios, backup windows, restore throughput, storage pricing, egress, and retrieval fees.

## Context to inspect
Inspect measured growth, actual dedupe ratios, peak ingest, archive tiers, cross-region copies, API charges, and historical restore bandwidth.

## Core knowledge
Capacity models must distinguish logical protected data from physical stored data. Restore performance can require more bandwidth and temporary capacity than steady-state backup ingestion.

## Procedure
1. Establish measured baseline by workload.
2. Forecast data growth and change rate.
3. Model full/incremental/log retention generations.
4. Apply conservative measured reduction ratios.
5. Include replication and immutable retention overhead.
6. Model ingest and restore throughput independently.
7. Include archive retrieval, egress, API, and temporary recovery costs.
8. Define capacity thresholds and expansion lead time.
9. Compare alternative retention/tiering designs.
10. Reconcile forecast with monthly actuals.

## Decision points
Scale storage before thresholds threaten backup completion. Use colder tiers only when retrieval latency and fees fit recovery objectives. Optimize retention based on risk, not cost alone.

## Common failure patterns
Assuming vendor-best dedupe; ignoring log growth; omitting cross-region copies; sizing only for ingestion; no emergency restore capacity.

## Verification
Back-test the model against historical usage and run representative throughput tests.

## Expected output
A capacity and cost forecast with assumptions, thresholds, and sensitivity ranges.

## Stop conditions
Escalate when growth data is unreliable, required budget cannot support approved recovery objectives, or capacity is already near a protection-impacting threshold.