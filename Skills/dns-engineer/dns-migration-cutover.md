# DNS Migration and Cutover

## Purpose
Migrate DNS providers, zones, resolvers, or namespaces without cache-driven outages or lost records.

## When to use
Provider replacement, cloud migration, resolver consolidation, registrar move, or namespace restructuring.

## Inputs
Current/target inventories, zone exports, TTLs, delegation, DNSSEC, traffic, dependencies, change window.

## Context to inspect
Provider-specific record types, hidden records, dynamic updates, secondary transfers, DS/glue, split views, query analytics, and automation ownership.

## Core knowledge
DNS migration has overlapping old/new control planes and cached data. Safe cutovers pre-stage target state and retain old service through TTL-safe stabilization.

## Procedure
1. Export and normalize complete current state.
2. Identify provider-specific features and unsupported records.
3. Lower relevant TTLs in advance.
4. Build target zones/resolvers and validate directly.
5. Synchronize dynamic or frequently changing records.
6. Coordinate DNSSEC keys/DS if signed.
7. Change delegation or client resolver configuration.
8. Monitor old and new query traffic/errors.
9. Keep old infrastructure available through cache/rollback window.
10. Restore TTLs and decommission only after dependency validation.

## Decision points
Use secondary-transfer migration when providers support compatible AXFR/IXFR; IaC/import may be better when normalization and governance are required. Preserve nameserver hostnames only when glue and operational ownership are clear.

## Common failure patterns
Missing TXT/MX records, premature old-provider shutdown, orphaned DS, forgotten private views, dynamic records diverging, and lowering TTL too late.

## Verification
Compare zone contents, query every authority, validate DNSSEC, observe recursive answers and traffic transition, and test rollback.

## Expected output
Migration plan, normalized inventory, cutover/rollback sequence, and post-cutover evidence.

## Stop conditions
Stop on unexplained record differences, unresolved DNSSEC state, unknown dynamic writers, or target feature gaps affecting critical services.