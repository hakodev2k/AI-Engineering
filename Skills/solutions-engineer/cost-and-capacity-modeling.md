# Cost and Capacity Modeling

## Purpose
Estimate solution capacity and total technical cost using explicit workload assumptions and sensitivity analysis.

## When to use
Use during architecture selection, commercial evaluation, scaling planning, and migration decisions.

## Inputs
Traffic, storage, compute profile, growth, regions, service pricing, support needs, availability design.

## Context to inspect
Peak load, utilization, egress, replicas, backups, observability volume, licensing, reserved capacity, and operational labor.

## Core knowledge
Unit economics matter more than a single monthly estimate. Cost models should expose assumptions and nonlinear drivers such as replication, egress, retention, and peak provisioning.

## Procedure
1. Define workload units and growth horizon.
2. Estimate compute, storage, network, and managed-service consumption.
3. Include redundancy, backups, telemetry, and environments.
4. Model peak and average utilization.
5. Add operational and support costs where material.
6. Calculate unit costs.
7. Run sensitivity scenarios for major uncertain drivers.
8. Compare alternatives against required outcomes.

## Decision points
Optimize cost only after protecting mandatory reliability/security constraints. Prefer commitments when utilization is predictable; preserve elasticity under uncertainty.

## Common failure patterns
Ignoring egress, non-production environments, growth, redundancy, telemetry, or operational labor; presenting estimates as guarantees.

## Verification
Inputs are traceable, calculations reproduce, and sensitivity analysis covers dominant uncertainties.

## Expected output
A transparent capacity and cost model with ranges and drivers.

## Stop conditions
Stop when workload assumptions or pricing inputs are too uncertain for a decision-grade estimate.