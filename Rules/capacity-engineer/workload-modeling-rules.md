# Workload Modeling

## Purpose
Create workload models that translate business demand into resource pressure and system behavior.

## Scope
Applies to online traffic, batch processing, asynchronous jobs, data pipelines, storage growth, and mixed workloads.

## MUST
- Workload models MUST identify the workload units that drive resource consumption.
- Models MUST capture concurrency, request mix, payload size, read/write ratio, burstiness, and background work when material.
- Capacity assumptions MUST be validated against production telemetry or representative tests.
- Models MUST be revised when architecture or workload composition changes materially.

## MUST NOT
- MUST NOT infer resource demand from request count alone when request cost varies materially.
- MUST NOT use synthetic workloads that omit known expensive paths and then claim production capacity.
- MUST NOT treat correlated workload dimensions as independent without evidence.

## SHOULD
- Models SHOULD separate steady-state, burst, recovery, and catch-up behavior.
- Representative percentile distributions SHOULD be preferred over averages for highly variable workloads.

## Exceptions
Simplified models require documented limitations, risk, evidence supporting adequacy, and a review trigger.

## Verification
Compare workload-model assumptions with traces, logs, metrics, production distributions, and representative performance-test results.
