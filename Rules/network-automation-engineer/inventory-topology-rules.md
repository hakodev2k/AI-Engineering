# Inventory and Topology Rules

## Purpose
Keep automation targets and connectivity models accurate enough for safe change planning.

## Scope
Device identity, interfaces, sites, roles, links, capabilities, lifecycle state, and target selection.

## MUST
- Every automation target MUST have a stable unique identity and explicit lifecycle state.
- Topology-dependent changes MUST validate required adjacencies and endpoints before execution.
- Target selectors MUST be reviewable and MUST show the resolved device set before a production change.
- Decommissioned, quarantined, or unknown devices MUST be excluded by default.
- Capability-dependent logic MUST verify platform and feature support rather than relying on naming conventions.

## MUST NOT
- MUST NOT use ambiguous hostnames, regexes, tags, or site names as the sole safety boundary for destructive or broad changes.
- MUST NOT assume inventory freshness when the operation depends on recent physical or logical topology changes.
- MUST NOT automatically activate newly discovered devices into production scope without validation.

## SHOULD
- Inventory SHOULD record provenance and last verification time for operationally important fields.
- Topology models SHOULD distinguish intended, discovered, and inferred relationships.

## Exceptions
Exceptions require bounded scope, evidence supporting the alternate target set, rollback strategy, and approval for production-impacting operations.

## Verification
Inspect resolved targets, inventory provenance, topology consistency checks, discovery timestamps, lifecycle filters, and tests for empty, stale, duplicated, and unexpectedly broad selections.