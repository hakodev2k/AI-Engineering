# Network Configuration Generation

## Purpose
Render deterministic device configuration from validated intent while containing vendor-specific syntax.

## When to use
Use for standardized service provisioning, device builds, migrations, and configuration replacement workflows.

## Inputs
Validated intent model, platform facts, templates/renderers, feature mappings, and policy constraints.

## Context to inspect
Existing configuration conventions, platform syntax/version, defaults, feature dependencies, and template library.

## Core knowledge
Templates should render from structured data and remain presentation-focused. Business logic belongs in models/validators, not scattered template conditionals.

## Procedure
1. Validate intent and platform capability.
2. Normalize data before rendering.
3. Select platform/feature templates explicitly.
4. Keep templates deterministic and side-effect free.
5. Render complete candidate output.
6. Parse or lint generated syntax when tools exist.
7. Compare candidate with current configuration semantically.
8. Flag destructive or high-risk diffs.
9. Test representative variants.
10. Version templates with model compatibility.

## Decision points
Generate full configuration for immutable/rebuild workflows; generate scoped deltas for brownfield systems where replacement is unsafe.

## Common failure patterns
Logic-heavy templates, whitespace/order churn, missing defaults, vendor syntax leakage into source data, and rendering without capability checks.

## Verification
Golden tests, schema validation, device/lab parse checks, semantic diff, and post-deployment state verification.

## Expected output
Deterministic candidate configuration plus validation and diff evidence.

## Stop conditions
Stop when required platform capability is unknown, generated diff is unexpectedly broad, or rollback cannot be defined.