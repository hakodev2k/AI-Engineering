# Data Classification and Protection

## Purpose
Apply security controls according to the sensitivity and business impact of database data.

## When to use
Use for new schemas, privacy reviews, control design, migrations, or unknown sensitive-data footprint.

## Inputs
Schema, data dictionary, regulatory requirements, business definitions, retention rules, and sample metadata where permitted.

## Context to inspect
Inspect tables, columns, derived datasets, views, exports, logs, replicas, and downstream consumers. Avoid copying sensitive production values unnecessarily.

## Core knowledge
Classification should drive access, encryption, masking, retention, monitoring, and incident priority. Derived or combined data can be more sensitive than individual source fields.

## Procedure
1. Define or adopt classification levels.
2. Inventory data domains and owners.
3. Identify regulated, confidential, credential, financial, and identity data.
4. Label schemas or metadata where supported.
5. Map required controls by classification.
6. Review derived fields and free-text columns.
7. Propagate classification to replicas and exports.
8. Establish review triggers for schema changes.

## Decision points
Use automated discovery to improve coverage but require human validation for business context. Sample data only when metadata is insufficient and access is authorized.

## Common failure patterns
Classifying only obvious columns, ignoring derived data, labels without enforcement, stale classifications, and sensitive data copied into lower environments.

## Verification
Compare classifications against schemas and business ownership; sample control enforcement for each level.

## Expected output
An actionable data inventory with classification-linked controls.

## Stop conditions
Escalate when ownership is unknown, legal interpretation is required, or discovery would expose data beyond authorized scope.