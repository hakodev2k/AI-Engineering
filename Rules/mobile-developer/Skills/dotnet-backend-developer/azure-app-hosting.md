# Azure Application Hosting

## Purpose
Choose and operate appropriate Azure hosting for .NET backend workloads with reliability, scale, security, and cost trade-offs understood.

## When to use
Hosting new APIs/workers, moving workloads, scaling incidents, or architecture reviews involving App Service, Functions, Container Apps, or related services.

## Inputs
Workload shape, latency/SLA, traffic pattern, runtime duration, networking, identity, scaling, cost constraints.

## Context to inspect
Current hosting, autoscale, managed identity, networking, health checks, deployment slots/revisions, diagnostics, quotas.

## Core knowledge
App Service suits long-running web apps; Functions suit event/serverless workloads with execution constraints; Container Apps suit containerized services/jobs needing managed scaling. Managed identity reduces secret handling.

## Procedure
1. Classify workload: request-driven, event-driven, scheduled, long-running.
2. Define availability/latency and scaling needs.
3. Evaluate hosting options against runtime limits and operational skill.
4. Prefer managed identity for Azure resource access.
5. Configure health/readiness and autoscale from meaningful signals.
6. Set resource limits and quotas.
7. Enable telemetry and deployment rollback mechanism.
8. Load/failure test expected scaling behavior.
9. Review cost under baseline and peak.

## Decision points
Choose simpler managed hosting unless container control or workload constraints justify added complexity. Do not choose serverless solely for low idle cost when latency/runtime limits conflict.

## Common failure patterns
Scaling only on CPU for I/O workloads, secrets in settings, no cold-start consideration, no quota review, health probes that miss dependencies.

## Verification
Deployment smoke test, scale test, identity access test, restart/failure test, cost estimate.

## Expected output
A hosting choice tied to workload and NFR evidence.

## Stop conditions
Escalate network/security topology or production subscription permission changes.