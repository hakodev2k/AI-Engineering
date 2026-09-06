# Observability Strategy

## Purpose
Define an evidence-driven observability strategy for AI systems so teams can explain quality, latency, cost, reliability, and safety behavior in production.

## When to use
Use when launching or redesigning an AI service, introducing new models or agents, or when production behavior is difficult to diagnose. Do not start by adding dashboards without first defining decisions and failure modes.

## Inputs
System architecture, user journeys, model providers, agent/tool flows, SLOs, risk requirements, telemetry stack, incident history, cost constraints, and privacy rules.

## Preconditions
Critical system boundaries and owners are identifiable. Production telemetry collection is technically and legally permitted.

## Context to inspect
Inspect request paths, model calls, retrieval, tool execution, queues, external APIs, safety controls, deployment topology, existing logs/metrics/traces, and current alert policies.

## Core knowledge
AI observability must correlate system telemetry with model behavior. Four dimensions matter together: service health, model quality, operational cost, and risk. Aggregate metrics are useful for trends; traces and structured events explain individual failures. High-cardinality attributes require deliberate controls.

## Procedure
1. Identify critical user journeys and failure outcomes.
2. Define operational questions the telemetry must answer.
3. Map each journey across application, model, retrieval, tool, and infrastructure boundaries.
4. Define SLI candidates for availability, latency, quality, cost, and safety.
5. Specify trace boundaries and correlation identifiers.
6. Define structured event schemas and sensitive-data handling.
7. Choose metric dimensions with explicit cardinality budgets.
8. Define retention, sampling, and access controls.
9. Design dashboards and alerts around decisions, not component inventory.
10. Validate the strategy against representative incidents.

## Decision points
Prefer metrics for trends, traces for causal paths, and logs/events for detailed evidence. Capture raw prompts or responses only when policy permits and diagnostic value justifies exposure. Use sampling when volume is high, but preserve rare failures and high-risk events.

## Common failure patterns
Telemetry without correlation IDs, unbounded labels, logging secrets or PII, measuring only infrastructure, ignoring model quality, alerting on every fluctuation, and retaining data without purpose.

## Verification
Demonstrate that a reviewer can answer: what failed, where, for whom, under which model/configuration, with what latency/cost impact, and whether the problem is recurring.

## Expected output
An observability plan covering telemetry architecture, SLIs, trace model, event schemas, retention, access, dashboards, alerts, ownership, and validation scenarios.

## Stop conditions
Stop when required telemetry violates policy, critical ownership is undefined, or production access needed for validation is unavailable.