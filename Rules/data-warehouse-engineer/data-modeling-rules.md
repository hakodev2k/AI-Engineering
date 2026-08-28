# Data Modeling Rules

## Purpose
Ensure analytical models express business meaning consistently and remain evolvable.

## Scope
Applies to dimensional models, normalized analytical models, data vault patterns, marts, and shared entities.

## MUST
- Grain MUST be declared for every fact-like model before measures are defined.
- Keys, cardinality, nullability, slowly changing behavior, and temporal semantics MUST be explicit.
- Model changes MUST assess downstream compatibility and historical interpretation.
- Shared business concepts MUST use governed definitions rather than local reinterpretations.

## MUST NOT
- MUST NOT mix multiple grains in one model without an explicit, tested design.
- MUST NOT encode business meaning only in undocumented SQL expressions.

## SHOULD
- Models SHOULD optimize for understandable analytical use before premature physical optimization.
- Reusable dimensions SHOULD be preferred when they preserve consistent semantics.

## Exceptions
Denormalization or specialized models require documented workload evidence and ownership.

## Verification
Review model documentation, schema definitions, grain tests, relationship tests, and representative analytical queries.