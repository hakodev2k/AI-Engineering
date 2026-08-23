# Edge Computing Design

## Purpose
Place computation at devices or gateways when latency, bandwidth, privacy, resilience, or cost requires it.

## When to use
Use when cloud-only processing is too slow, expensive, privacy-sensitive, or unavailable offline.

## Inputs
Workloads, latency SLOs, data rates, compute budgets, privacy rules, connectivity profile.

## Context to inspect
Device resources, gateway topology, cloud services, models/rules, synchronization, and operational ownership.

## Core knowledge
Edge systems trade centralized simplicity for locality and resilience. They introduce versioning, state synchronization, constrained observability, and heterogeneous hardware concerns.

## Procedure
1. Classify workloads by latency, privacy, bandwidth, and availability needs.
2. Measure edge compute/storage budgets.
3. Define local state and authoritative sources.
4. Design cloud-edge synchronization and conflict handling.
5. Package workloads for controlled deployment.
6. Add resource limits, watchdogs, telemetry, and rollback.
7. Test disconnected and resource-pressure behavior.

## Decision points
Keep safety-critical and low-latency decisions local; centralize compute when global context, elastic resources, or rapid iteration dominates.

## Common failure patterns
Duplicated business truth, unbounded local storage, no version compatibility, and treating gateways as unmanaged servers.

## Verification
Measure latency, resource use, offline correctness, synchronization recovery, and upgrade behavior.

## Expected output
A justified edge/cloud partition with lifecycle controls.

## Stop conditions
Escalate when local decisions can create unsafe outcomes without authoritative data.