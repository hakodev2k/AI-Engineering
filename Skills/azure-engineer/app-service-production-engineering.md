# App Service Production Engineering

## Purpose
Design and operate Azure App Service workloads for secure deployment, predictable scaling, availability, and diagnosability.

## When to use
Use for web apps/APIs on App Service, production hardening, scaling issues, deployment-slot design, or platform troubleshooting.

## Inputs
Application runtime, traffic profile, dependencies, availability target, deployment method, network requirements, and observability needs.

## Context to inspect
Inspect App Service plan, app settings, deployment slots, health checks, autoscale, VNet integration, private endpoints, TLS, managed identity, diagnostics, and worker metrics.

## Core knowledge
App Service separates application configuration from compute plan capacity. Scale-out behavior, cold starts, deployment slots, SNAT/network constraints, and health checks can affect reliability independently of application correctness.

## Procedure
1. Establish runtime and availability requirements.
2. Select plan tier and instance sizing from measured needs.
3. Configure managed identity and secret references.
4. Design inbound and outbound network paths.
5. Configure health checks that reflect instance readiness without expensive dependency fan-out.
6. Define autoscale using stable demand signals.
7. Use deployment slots where safer warm-up and swap behavior are valuable.
8. Configure logs, metrics, Application Insights, and alerts.
9. Test scale, restart, slot swap, and dependency-failure behavior.
10. Document rollback and capacity limits.

## Decision points
Scale up when a workload needs stronger per-instance resources; scale out for parallelizable traffic and resilience. Use slots when deployment risk justifies additional operational complexity.

## Common failure patterns
Tiny plans with chronic CPU/memory pressure, health checks that always succeed, secrets in settings, uncontrolled outbound connections, sticky slot settings configured incorrectly, and autoscale without load testing.

## Verification
Load test representative traffic, inspect worker metrics and traces, perform a deployment-slot swap, restart instances, and confirm health-based traffic handling.

## Expected output
A production-ready App Service configuration with tested deployment, scaling, security, and observability behavior.

## Stop conditions
Stop when application state prevents safe horizontal scaling, network dependencies are undocumented, or capacity changes require cost approval not yet obtained.