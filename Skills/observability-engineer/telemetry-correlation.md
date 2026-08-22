# Telemetry Correlation

## Purpose
Connect logs, metrics, traces, deployments, and business events so investigations can move efficiently between signals.

## When to use
Use when responders must manually reconstruct context across telemetry systems or when traces and logs cannot be joined reliably.

## Inputs
Telemetry schemas, trace context, service metadata, deployment pipeline, event identifiers, and backend capabilities.

## Context to inspect
Inspect resource naming, trace/span IDs, request IDs, service versions, environment fields, deployment markers, and timestamp synchronization.

## Core knowledge
Correlation requires stable identifiers and consistent resource identity. Cross-signal navigation should preserve context while avoiding unbounded metric dimensions.

## Procedure
1. Define canonical service and environment identity.
2. Propagate trace context across supported boundaries.
3. Add trace/span identifiers to structured logs.
4. Record deployment version and instance metadata.
5. Emit deployment/change events.
6. Standardize timestamps and clocks.
7. Configure links from dashboards to traces and logs.
8. Test correlation through synchronous and asynchronous paths.

## Decision points
Use trace IDs in logs, not metric labels. Use bounded deployment/version dimensions when useful for comparisons.

## Common failure patterns
Different service names per signal, missing async propagation, local timestamps, metric cardinality explosion, and correlation IDs regenerated mid-flow.

## Verification
Start from an alert and prove a responder can reach the relevant trace, logs, deployment change, and affected service without manual ID reconstruction.

## Expected output
Consistent cross-signal correlation conventions and working navigation paths.

## Stop conditions
Escalate when upstream systems strip required propagation or clocks cannot be synchronized sufficiently.