# SCIM Provisioning and Reconciliation

## Purpose
Engineer standards-based provisioning and reconciliation so accounts and group memberships converge to authoritative identity state.

## When to use
Use when integrating SaaS or applications with SCIM, replacing manual provisioning, or fixing identity drift.

## Inputs
SCIM schemas, source attributes, target capabilities, matching keys, lifecycle events, group semantics, rate limits.

## Context to inspect
Connector mappings, filters, pagination, PATCH semantics, retry behavior, uniqueness constraints, target deletion/deactivation behavior, logs.

## Core knowledge
Provisioning must be idempotent, deterministic, and reconciliation-capable. Matching on mutable attributes causes duplicates and takeover risk.

## Procedure
1. Identify immutable correlation keys.
2. Map required and optional attributes explicitly.
3. Define create, update, disable, delete, and reactivation semantics.
4. Handle groups and memberships separately from user existence.
5. Implement pagination, rate-limit handling, and bounded retry.
6. Define conflict behavior for duplicate matches.
7. Reconcile desired versus actual state periodically.
8. Quarantine ambiguous objects rather than guessing.
9. Instrument failed operations and drift age.
10. Test replay, out-of-order events, rehire, rename, and target outage cases.

## Decision points
Prefer disable over delete when audit/history or application data retention requires preservation.

## Common failure patterns
Email matching, endless retries, delete-on-source-missing without safeguards, group overwrite races, and no reconciliation after event loss.

## Verification
Run create/update/disable/reactivate/group-change tests and compare target state to expected state after reconciliation.

## Expected output
Schema mapping, lifecycle semantics, matching policy, retry/reconciliation design, and evidence.

## Stop conditions
Escalate when target APIs cannot support safe deactivation or correlation cannot be made deterministic.