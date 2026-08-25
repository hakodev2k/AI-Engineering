# Dependency Graph Engineering

## Purpose
Model and troubleshoot Terraform dependency ordering without unnecessary serialization or brittle manual dependencies.

## When to use
Unknown values, ordering failures, cycles, slow applies, or module dependency design.

## Inputs
Configuration, plan graph, resource references, provider behavior, error logs.

## Context to inspect
Implicit references, depends_on, module-level dependencies, data sources, remote state, create/destroy ordering.

## Core knowledge
Terraform infers dependencies from expression references. depends_on is for hidden behavioral dependencies, not a general ordering tool; excessive dependencies increase unknown values and reduce parallelism.

## Procedure
1. Identify the failing or unexpectedly ordered nodes.
2. Trace references that create graph edges.
3. Remove dependencies represented only by convention when a direct reference can express them.
4. Add depends_on only for real hidden dependencies.
5. Break cycles by redesigning ownership or splitting phases/states.
6. Re-plan and inspect unknown-value propagation.
7. Measure apply parallelism when performance matters.

## Decision points
Keep resources together when a direct graph expresses lifecycle; split stacks when dependency cycles reflect independent control planes.

## Common failure patterns
Module-wide depends_on, timestamp/null-resource ordering hacks, remote-state cycles, and assuming file order controls execution.

## Verification
Graph/plan shows only necessary edges, cycle errors disappear, and apply order is correct under clean creation and destruction.

## Expected output
A minimal explicit dependency graph with predictable lifecycle.

## Stop conditions
Stop if required ordering is outside provider/Terraform visibility and cannot be represented safely without architectural change.