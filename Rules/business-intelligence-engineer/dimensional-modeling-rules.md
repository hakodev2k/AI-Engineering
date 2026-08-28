# Dimensional Modeling Rules

## Purpose
Preserve analytical correctness and maintainable warehouse structures.

## Scope
Applies to facts, dimensions, snapshots, slowly changing dimensions, and analytical marts.

## MUST
- Fact tables MUST declare grain before measures are added.
- Facts and dimensions MUST use keys that prevent accidental fan-out joins.
- Slowly changing dimension behavior MUST be explicit for attributes whose history matters.
- Snapshot tables MUST define snapshot cadence and interpretation.

## MUST NOT
- MUST NOT mix multiple incompatible grains in one fact table without an explicit, reviewed design.
- MUST NOT overwrite historical attributes when historical analysis requires prior values.

## SHOULD
- Models SHOULD favor conformed dimensions for shared business concepts.

## Exceptions
Exceptions require documented analytical need, alternatives considered, correctness evidence, and architecture review.

## Verification
Inspect model diagrams, key constraints, sample joins, aggregation tests, and history-change scenarios.