# Observability as Code

## Purpose
Manage dashboards, alerts, recording rules, collectors, and telemetry policy through versioned, reviewable automation.

## When to use
Use when observability configuration must be repeatable across environments or manual UI changes cause drift.

## Inputs
Telemetry platform APIs, repository conventions, CI/CD, environment model, secrets management, and current configuration.

## Context to inspect
Inspect manually managed resources, export formats, ownership, dependencies, environment differences, and deployment permissions.

## Core knowledge
Observability configuration is production code. It needs review, testing, versioning, rollback, and separation of environment-specific values from reusable definitions.

## Procedure
1. Inventory managed dashboards, alerts, and pipeline configuration.
2. Choose declarative provider or API automation.
3. Import or recreate resources without destructive drift.
4. Parameterize legitimate environment differences.
5. Store secrets outside source control.
6. Add linting and query validation.
7. Require review for paging and SLO changes.
8. Deploy through controlled CI/CD.
9. Detect configuration drift.

## Decision points
Use shared modules for stable standards but allow service-owned extensions. Avoid abstraction layers that hide important telemetry semantics.

## Common failure patterns
Secrets in repositories, generated unreadable definitions, destructive imports, one global dashboard template, and bypassing review with manual edits.

## Verification
Rebuild a representative environment from code, compare resources with expected state, and test rollback.

## Expected output
Version-controlled, reproducible observability configuration with safe deployment controls.

## Stop conditions
Stop before importing resources when ownership or destructive-change impact is uncertain.