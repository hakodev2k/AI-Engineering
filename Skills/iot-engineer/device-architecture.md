# Device Architecture

## Purpose
Design IoT device boundaries that balance capability, cost, power, reliability, security, and field maintainability.

## When to use
Use when selecting device responsibilities or changing hardware/software partitioning.

## Inputs
Use cases, hardware constraints, connectivity, power budget, lifecycle, environment, cost targets.

## Context to inspect
Existing firmware, sensors, actuators, gateways, protocols, cloud dependencies, deployment environment, and failure history.

## Core knowledge
Senior IoT design treats devices as long-lived distributed-system nodes. Decisions must account for intermittent networks, constrained compute, physical access, version skew, and recovery.

## Procedure
1. Define device responsibilities and safety boundaries.
2. Quantify CPU, memory, storage, power, latency, and cost constraints.
3. Separate real-time/local functions from cloud-dependent functions.
4. Define hardware abstraction and replaceable modules.
5. Identify failure modes and degraded operation.
6. Define identity, secure boot, update, telemetry, and recovery needs.
7. Document interfaces and lifecycle assumptions.
8. Prototype high-risk constraints before committing.

## Decision points
Prefer local processing for latency, privacy, safety, or offline operation; prefer cloud processing when centralized compute and rapid evolution outweigh connectivity dependence.

## Common failure patterns
Cloud-only critical paths, hidden hardware assumptions, no recovery path, excessive device complexity, and ignoring lifecycle cost.

## Verification
Validate resource budgets, offline behavior, failure recovery, security boundaries, and representative hardware tests.

## Expected output
A documented device architecture with boundaries, constraints, risks, and verification evidence.

## Stop conditions
Escalate when safety requirements, hardware capabilities, or lifecycle constraints are unknown.