# Telemetry Data Governance

## Purpose
Establish governance for telemetry schemas, ownership, sensitive data, retention, and lifecycle so observability remains trustworthy and manageable at scale.

## When to use
Use when multiple teams publish telemetry, schemas drift, sensitive fields appear, or ownership and lifecycle are unclear.

## Inputs
Telemetry schemas, ownership map, data classifications, retention rules, compliance requirements, platform conventions.

## Context to inspect
Inspect naming conventions, semantic attributes, deprecated fields, ownership metadata, PII/secret detection, and retention exceptions.

## Core knowledge
Understand schema governance, semantic conventions, data classification, lineage, ownership, retention, and backward-compatible evolution.

## Procedure
1. Inventory shared telemetry conventions and deviations.
2. Define canonical names, units, required resource fields, and ownership metadata.
3. Classify sensitive fields and prohibit secrets by default.
4. Establish schema review for high-impact shared signals.
5. Define deprecation and migration rules.
6. Automate linting or policy checks where feasible.
7. Assign data owners and escalation paths.
8. Review exceptions and stale telemetry periodically.

## Decision points
Govern shared semantic contracts strictly; allow local extension when it does not break interoperability or cost controls.

## Common failure patterns
Central standards with no enforcement, silent field renames, inconsistent units, orphaned telemetry, and indefinite exceptions.

## Verification
Run schema checks against representative producers, verify ownership coverage, and test sensitive-data detection.

## Expected output
A governed telemetry contract with enforceable conventions, ownership, and lifecycle rules.

## Stop conditions
Stop if legal data classification or authoritative ownership cannot be established.