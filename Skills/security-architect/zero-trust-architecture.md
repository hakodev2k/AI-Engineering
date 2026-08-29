# Zero Trust Architecture

## Purpose
Design access paths around explicit verification, minimal trust, and continuous policy enforcement rather than implicit network location.

## When to use
Use for hybrid cloud, remote workforce, service-to-service access, sensitive environments, or modernization of perimeter-heavy designs.

## Inputs
Identity architecture, asset inventory, data classification, network topology, device posture signals, service dependencies, telemetry capabilities.

## Preconditions
Identity, device, workload, and resource ownership are sufficiently understood to define policy.

## Context to inspect
Current segmentation, VPN dependencies, authentication flows, certificate infrastructure, endpoint controls, service mesh, proxy layers, and logging.

## Core knowledge
Zero trust is an architecture principle, not a product. Effective designs combine strong identity, resource-level authorization, segmentation, device/workload posture, short-lived credentials, and observability.

## Procedure
1. Identify protected resources and high-risk access paths.
2. Replace location-based trust assumptions with explicit identity and policy checks.
3. Segment users, workloads, and administration planes.
4. Define device and workload assurance requirements.
5. Minimize credential lifetime and privilege scope.
6. Add policy enforcement at suitable control points.
7. Design telemetry for denied and anomalous access.
8. Plan migration in phases to avoid availability regressions.
9. Validate emergency access and dependency failure behavior.

## Decision points
Place enforcement close to protected resources when practical. Use centralized policy where consistency matters, but avoid creating a single operational bottleneck.

## Common failure patterns
Renaming existing perimeter controls, trusting internal networks broadly, ignoring service identities, excessive policy complexity, and no migration strategy.

## Verification
Demonstrate that access decisions depend on validated identity and context, lateral reach is constrained, and denied paths are observable.

## Expected output
A phased zero-trust target architecture with policy boundaries, enforcement points, dependencies, and migration controls.

## Stop conditions
Stop when identity quality is insufficient, critical dependencies cannot tolerate new enforcement points, or required telemetry is unavailable.