# Lineage Rules

## Purpose
Make upstream origins and downstream dependencies visible enough to assess change and incident impact.

## Scope
Applies to contracted datasets, streams, tables, metrics, transformations, and derived data products.

## MUST
- Critical contracts MUST record authoritative upstream sources and material downstream dependencies.
- Material transformation boundaries MUST be traceable to the contracts they consume and produce.
- Lineage metadata MUST be updated when ownership, source, or dependency relationships change.
- Change reviews MUST use available lineage to identify affected consumers before breaking or semantic changes.

## MUST NOT
- Teams MUST NOT rely solely on tribal knowledge to determine impact for critical contracts.
- Derived products MUST NOT be presented as source-authoritative when lineage shows they are transformed copies.

## SHOULD
- Lineage collection SHOULD be automated where platform support exists.
- Human-maintained annotations SHOULD focus on semantic relationships automation cannot infer.

## Exceptions
Exceptions require a documented reason, bounded impact, owner, and plan to restore traceability.

## Verification
Inspect lineage graphs, transformation metadata, dependency declarations, and change-review evidence. Compare recorded lineage with deployed jobs and known consumers.