# Lifecycle and Replacement Control

## Purpose
Control create, update, replacement, and deletion behavior for infrastructure whose availability or data durability matters.

## When to use
Stateful resources, immutable attributes, zero-downtime migrations, or destructive plan review.

## Inputs
Plan, provider schema behavior, SLA, data durability, naming constraints, dependency graph.

## Context to inspect
replace triggers, lifecycle blocks, ForceNew attributes, quotas, unique names, downstream dependencies.

## Core knowledge
create_before_destroy, prevent_destroy, ignore_changes, and replace_triggered_by alter lifecycle but do not replace architectural migration planning.

## Procedure
1. Identify attributes causing replacement.
2. Assess downtime, data loss, quota, naming, and dependency impact.
3. Prefer in-place change when provider and requirements allow.
4. For replacement, design parallel creation and cutover where feasible.
5. Use lifecycle controls narrowly and document rationale.
6. Plan creation and destruction paths separately.
7. Add backups and rollback for stateful systems.
8. Verify post-cutover convergence.

## Decision points
Use create_before_destroy only when duplicate capacity/names are possible; use prevent_destroy as a guardrail, not a permanent substitute for approvals.

## Common failure patterns
Blanket ignore_changes, prevent_destroy that blocks recovery, replacement without quota checks, and assuming create_before_destroy guarantees zero downtime.

## Verification
Reviewed plan matches the migration sequence; service/data checks pass before old resources are removed.

## Expected output
Predictable lifecycle behavior with explicit downtime and rollback strategy.

## Stop conditions
Stop on unbacked stateful replacement, unquantified downtime, quota blockers, or destructive change without owner approval.