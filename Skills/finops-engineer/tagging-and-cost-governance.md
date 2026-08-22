# Tagging and Cost Governance

## Purpose
Design enforceable metadata and ownership controls that make cloud spend attributable without creating unusable operational bureaucracy.

## When to use
Use when cost allocation has ownership gaps, resources proliferate without accountability, or governance standards are being introduced.

## Inputs
Resource inventory, organization model, billing dimensions, IaC conventions, policy engines, existing tags, exceptions.

## Context to inspect
Inspect resource creation paths, inherited metadata, immutable provider fields, IaC modules, deployment pipelines, ephemeral resources, and policy enforcement capabilities.

## Core knowledge
Tags are one signal, not a complete source of truth. Good governance combines hierarchy, provider metadata, deployment identity, CMDB/catalog data, and policy. Required metadata should be minimal and actionable.

## Procedure
1. Define decisions metadata must support.
2. Identify authoritative ownership dimensions.
3. Establish a small required schema with allowed values.
4. Define inheritance and precedence rules.
5. Automate metadata in IaC and provisioning paths.
6. Add preventive or detective policy according to operational risk.
7. Build exception handling with owner and expiry.
8. Measure coverage, validity, and staleness.
9. Remediate legacy resources in prioritized batches.
10. Review schema when organization or reporting needs change.

## Decision points
Block creation only when missing metadata creates material governance risk and automation is reliable. Otherwise detect and remediate. Prefer platform-derived ownership when tags can be freely edited.

## Common failure patterns
Dozens of mandatory tags, free-text owner names, policy rollout that breaks deployments, no exception expiry, and measuring tag presence instead of correctness.

## Verification
New resources receive valid metadata automatically; policy tests cover compliant and noncompliant cases; allocation coverage improves; exception inventory is bounded and owned.

## Expected output
A metadata standard, enforcement design, remediation plan, coverage metrics, and exception process.

## Stop conditions
Escalate when enforcement could disrupt production provisioning or authoritative ownership data does not exist.