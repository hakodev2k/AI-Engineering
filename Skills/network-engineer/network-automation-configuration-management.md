# Network Automation and Configuration Management

## Purpose
Automate repetitive network changes safely with source-controlled intent, validation, idempotency, and rollback.

## When to use
Use for fleet configuration, compliance, provisioning, migrations, repetitive policy updates, or drift remediation.

## Inputs
Inventory, source-of-truth data, device APIs/models, intended configuration, credentials mechanism, current state, test environment, and change policy.

## Context to inspect
Platform/version differences, API/NETCONF/RESTCONF/CLI capabilities, templates, secrets handling, rate limits, HA pairs, out-of-band access, and existing automation.

## Core knowledge
Automation multiplies both correctness and mistakes. Separate data, intent, rendering, transport, and validation. Prefer structured APIs/models over screen scraping. Idempotency and bounded concurrency reduce fleet risk.

## Procedure
1. Define one repeatable outcome and blast radius.
2. Establish authoritative inventory and variables.
3. Retrieve current state and detect unsupported platforms.
4. Encode intent in version-controlled data/templates or models.
5. Validate schema, types, references, and invariants before rendering.
6. Generate candidate configuration and diff against current state.
7. Run lint/static checks and lab tests.
8. Canary on representative low-risk devices.
9. Apply with bounded concurrency and per-device error handling.
10. Verify operational state, not only API success.
11. Stop automatically on defined failure thresholds.
12. Record results and reconcile source of truth.

## Decision points
Use declarative models where platform support is strong; imperative workflows may be necessary for ordered migrations. Auto-remediate only low-risk, well-understood drift.

## Common failure patterns
Blind templating, stale inventory, plaintext secrets, unbounded parallelism, treating command success as service success, non-idempotent scripts, and no partial-failure recovery.

## Verification
Confirm intended diffs, device state, routing/service health, compliance, repeat-run idempotency, and rollback behavior.

## Expected output
Reusable automation, validated data model, pre/post checks, execution evidence, and rollback/reconciliation procedure.

## Stop conditions
Stop on unexpected diff scope, unsupported device state, loss of management connectivity, verification failure, or error threshold breach.