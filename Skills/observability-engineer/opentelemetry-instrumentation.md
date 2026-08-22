# OpenTelemetry Instrumentation

## Purpose
Implement vendor-neutral telemetry collection using OpenTelemetry while preserving correct semantics and manageable overhead.

## When to use
Use when standardizing logs, metrics, and traces across services or reducing direct coupling to a telemetry vendor.

## Inputs
Application stack, OpenTelemetry SDKs, collector topology, backend destinations, semantic conventions, and performance constraints.

## Context to inspect
Inspect auto-instrumentation, manual instrumentation, resource attributes, exporters, processors, collector pipelines, sampling, and version compatibility.

## Core knowledge
OpenTelemetry separates instrumentation from export. Resource attributes describe the emitting entity; spans and metrics describe operations. Collectors provide processing and routing but introduce operational dependencies.

## Procedure
1. Inventory existing telemetry and duplicate instrumentation.
2. Define resource identity standards.
3. Enable supported automatic instrumentation.
4. Add manual instrumentation only for meaningful gaps.
5. Configure propagation and sampling.
6. Route through collectors where operationally justified.
7. Add filtering, batching, redaction, and retry controls.
8. Test exporter failure behavior and application overhead.
9. Validate semantic consistency across languages and services.

## Decision points
Use agents or auto-instrumentation for broad baseline coverage; use SDK changes for domain-specific signals. Choose direct export for simplicity or collectors for centralized policy and routing.

## Common failure patterns
Double instrumentation, inconsistent service names, collector retry storms, unbounded attributes, exporter blocking, and semantic-convention drift.

## Verification
Confirm all expected signals arrive with correct resource identity, correlation, and acceptable CPU, memory, and network overhead.

## Expected output
Portable OpenTelemetry instrumentation and a validated telemetry pipeline.

## Stop conditions
Escalate when SDK or collector compatibility is unsupported or telemetry changes materially threaten production performance.