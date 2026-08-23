# Blast Radius Analysis

## Purpose
Determine how far an incident has propagated and which systems, users, data sets, regions, or dependencies remain at risk.

## When to use
Use early in triage, after discovering a shared dependency failure, and after any evidence that scope is expanding.

## Inputs
Architecture maps, dependency graphs, telemetry, tenant or region dimensions, request traces, data lineage, and infrastructure topology.

## Context to inspect
Inspect shared services, queues, caches, identity systems, databases, networks, deployment rings, feature flags, and downstream consumers.

## Core knowledge
Blast radius is often wider than the initially visible symptom. Shared state and asynchronous propagation can hide delayed effects. Scope must be proven with telemetry rather than inferred from architecture alone.

## Procedure
1. Identify the first confirmed affected component and time window.
2. Trace upstream callers and downstream dependencies.
3. Segment telemetry by region, tenant, version, host, dependency, and operation.
4. Check shared data stores and asynchronous pipelines for propagated effects.
5. Identify unaffected control groups to bound scope.
6. Search for correlated error signatures outside the initial service.
7. Map current and plausible future propagation paths.
8. Prioritize containment at narrow choke points where possible.
9. Recalculate scope after mitigation.

## Decision points
Contain globally when propagation cannot be safely bounded; prefer targeted isolation when unaffected populations are clearly verified and global action would cause greater harm.

## Common failure patterns
Assuming one alert equals one service, overlooking delayed queues, ignoring shared credentials or configuration, and declaring scope from topology without runtime evidence.

## Verification
Confirm affected and unaffected segments using independent telemetry and verify containment prevents new propagation.

## Expected output
A blast-radius map with affected populations, dependencies, propagation paths, uncertainty, and containment targets.

## Stop conditions
Escalate when telemetry cannot distinguish affected populations or containment requires broad destructive action.