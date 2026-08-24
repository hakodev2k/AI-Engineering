# AI Platform Reliability Engineering

## Purpose
Apply reliability engineering to accelerator platforms so training and inference remain available despite node, network, storage, scheduler, and runtime failures.

## When to use
Use when defining SLOs, reducing repeated incidents, or hardening production AI infrastructure.

## Inputs
SLOs, incident history, dependency map, capacity data, failure rates, recovery objectives.

## Context to inspect
Failure domains, redundancy, spare capacity, restart behavior, checkpoints, serving replicas, control-plane dependencies, and runbooks.

## Core knowledge
AI reliability includes both service uptime and useful-compute completion. Expensive long-running jobs require checkpoint/restart engineering; online serving requires redundancy, bounded queues, and graceful degradation.

## Procedure
1. Define user-facing and platform SLOs.
2. Map critical dependencies and failure domains.
3. Identify single points of failure.
4. Establish redundancy and spare-capacity targets.
5. Validate checkpoint/restart for long jobs.
6. Validate replica failover and traffic draining for serving.
7. Define error budgets and operational thresholds.
8. Run controlled failure tests.
9. Convert incident findings into reliability backlog items.

## Decision points
Spend redundancy where failure cost exceeds idle capacity cost. Prefer graceful degradation when full service cannot be economically guaranteed.

## Common failure patterns
No spare GPUs, checkpoint files in the same failure domain, untested failover, infinite retries, and SLOs based only on control-plane uptime.

## Verification
Demonstrate recovery from representative node, storage, network, and serving failures within objectives.

## Expected output
A reliability model, SLOs, failure tests, and prioritized hardening actions.

## Stop conditions
Stop when business impact or recovery objectives cannot be defined.