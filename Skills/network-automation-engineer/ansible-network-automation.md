# Ansible Network Automation

## Purpose
Use Ansible to apply repeatable network configuration and validation with controlled scope and idempotent behavior.

## When to use
Use for configuration deployment, compliance, standardized changes, and multi-device orchestration.

## Inputs
Inventory, desired state, collections/modules, credentials, change window, validation criteria, and rollback plan.

## Context to inspect
Group/host variables, roles, collections, connection plugins, platform versions, vault/secret handling, and existing playbooks.

## Core knowledge
Network idempotency depends on module semantics and device behavior. Prefer resource modules or structured APIs over raw CLI when supported.

## Procedure
1. Validate inventory and grouping.
2. Model variables by intent and inheritance.
3. Select supported collections/modules.
4. Separate prechecks, change, and postchecks.
5. Use check/diff modes where trustworthy.
6. Limit blast radius with serial/canary execution.
7. Handle secrets through approved secret stores.
8. Capture structured results and failures.
9. Validate state after changes.
10. Maintain reusable roles and tests.

## Decision points
Use raw commands for diagnostics or unsupported features, not as the default configuration mechanism. Choose serial execution when shared failure domains make parallel change risky.

## Common failure patterns
CLI blobs in playbooks, variable precedence surprises, plaintext secrets, no postchecks, non-idempotent tasks, and fleet-wide first execution.

## Verification
Run syntax/lint checks, lab tests, limited canary deployment, second-run idempotency check, and state validation.

## Expected output
Reusable playbook/role, controlled inventory, validation evidence, and rollback instructions.

## Stop conditions
Abort on unexpected diffs, unsupported module behavior, degraded redundancy, or failed prechecks.