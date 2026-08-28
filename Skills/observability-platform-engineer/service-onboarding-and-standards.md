# Service Onboarding and Standards

## Purpose
Onboard services to the observability platform with consistent telemetry, ownership, dashboards, alerts, and operational readiness.

## When to use
Use when a new service, team, environment, or technology stack joins the shared observability platform.

## Inputs
Service architecture, owners, runtime, critical journeys, dependencies, deployment model, data classification.

## Context to inspect
Inspect existing instrumentation, health endpoints, logs, metrics, traces, SLOs, alerting, runbooks, and environment metadata.

## Core knowledge
Understand telemetry minimum standards, semantic conventions, service ownership, operational readiness, and progressive rollout.

## Procedure
1. Identify service owners and critical user journeys.
2. Verify resource identity and environment metadata.
3. Enable baseline logs, metrics, and traces appropriate to the runtime.
4. Define service-level dashboards and diagnostic drill-down.
5. Establish SLOs and actionable alerts where service criticality requires them.
6. Validate sensitive-data controls and access.
7. Load-test telemetry volume and cardinality.
8. Confirm runbooks, ownership, and escalation metadata.
9. Roll out progressively and inspect telemetry quality.
10. Record deviations from platform standards with owners and expiry dates.

## Decision points
Apply stricter requirements to customer-critical services; allow lightweight onboarding for low-risk workloads while retaining identity, ownership, and basic health telemetry.

## Common failure patterns
Copying generic dashboards, missing owners, environment labels with inconsistent values, paging before SLOs exist, and onboarding without cost estimates.

## Verification
Exercise representative success and failure paths, confirm correlation across signals, alert routing, dashboard usefulness, and telemetry cost.

## Expected output
A production-ready service observability package conforming to shared standards.

## Stop conditions
Stop production onboarding if ownership, sensitive-data handling, or critical signal verification is incomplete.