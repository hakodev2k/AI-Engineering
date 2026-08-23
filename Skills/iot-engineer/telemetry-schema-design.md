# Telemetry Schema Design

## Purpose
Create evolvable, efficient telemetry contracts that preserve meaning across heterogeneous device versions.

## When to use
Use for new telemetry, schema changes, analytics integration, or bandwidth reduction.

## Inputs
Measurements, events, consumers, units, sampling, retention, device versions.

## Context to inspect
Existing payloads, ingestion limits, analytics queries, firmware constraints, and schema registry/version conventions.

## Core knowledge
Telemetry is a long-lived contract. Stable semantics, explicit units, timestamps, quality indicators, version compatibility, and cardinality control matter more than convenient serialization.

## Procedure
1. Identify consumers and decisions each field supports.
2. Define names, types, units, ranges, nullability, and timestamp semantics.
3. Separate measurements, state, events, and diagnostic dimensions.
4. Choose encoding based on bandwidth and evolvability.
5. Define compatibility rules and schema versioning.
6. Remove redundant/high-cardinality fields.
7. Validate payload sizes and ingestion cost.
8. Test old/new producer-consumer combinations.

## Decision points
Use compact binary encoding for constrained links when tooling complexity is justified; use readable formats where interoperability and diagnostics dominate.

## Common failure patterns
Implicit units, overloaded fields, device-local timestamps without quality, breaking renames, and unbounded labels.

## Verification
Contract tests, representative payload measurements, compatibility tests, and downstream query validation.

## Expected output
A versioned telemetry contract with documented semantics and compatibility.

## Stop conditions
Stop when ownership of field meaning or downstream compatibility cannot be established.