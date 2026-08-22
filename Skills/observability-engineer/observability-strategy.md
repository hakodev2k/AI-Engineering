# Observability Strategy

## Purpose
Design an observability approach that lets teams understand system health, user impact, and failure causes from evidence rather than guesswork.

## When to use
Use when designing a new service, modernizing monitoring, preparing production readiness, or when incidents repeatedly lack diagnostic evidence.

## Inputs
Architecture, critical user journeys, SLOs, incident history, telemetry stack, ownership model, and cost constraints.

## Context to inspect
Map services, dependencies, trust boundaries, async flows, data stores, deployment topology, existing logs, metrics, traces, dashboards, and alerts.

## Core knowledge
Observability should answer operational questions, not maximize telemetry volume. Signals must connect technical behavior to user impact. Instrumentation, storage, retention, cardinality, sampling, privacy, and ownership are architectural concerns.

## Procedure
1. Identify critical journeys and failure modes.
2. Define operational questions teams must answer.
3. Map required logs, metrics, traces, and events to those questions.
4. Establish common service and correlation metadata.
5. Define SLO-oriented dashboards and alerts.
6. Set retention, sampling, cardinality, and cost policies.
7. Define telemetry ownership and review practices.
8. Validate coverage using realistic failure scenarios.

## Decision points
Prefer metrics for aggregation and alerting, traces for request-path causality, logs for detailed events, and profiles for resource hotspots. Add signals only when they improve a decision or investigation.

## Common failure patterns
Collecting everything, dashboard-first design, missing correlation IDs, telemetry without ownership, high-cardinality labels, and alerts disconnected from user impact.

## Verification
Run representative incidents and confirm responders can detect impact, isolate the failing component, correlate evidence, and identify next diagnostic actions.

## Expected output
A documented observability strategy with signal coverage, standards, ownership, cost controls, and validation evidence.

## Stop conditions
Escalate when critical journeys, ownership, privacy requirements, or telemetry platform constraints are unknown.