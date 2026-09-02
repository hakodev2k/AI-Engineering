# Span Modeling Rules

## Purpose
Represent distributed work with spans that are diagnostically meaningful and structurally correct.

## Scope
Applies to span boundaries, names, kinds, duration, parentage, links, and lifecycle.

## MUST
- Span boundaries MUST correspond to meaningful units of distributed work such as requests, remote calls, queue processing, or material internal operations.
- Span names MUST be stable and low-cardinality; variable identifiers MUST be attributes, not names.
- Span kind MUST match the operation's role when the instrumentation model supports it.
- Span lifetime MUST match the real operation and MUST end on all success and failure paths.

## MUST NOT
- MUST NOT create spans for every function or loop iteration by default.
- MUST NOT encode user IDs, raw URLs with identifiers, request IDs, or other high-cardinality values in span names.
- MUST NOT fabricate parent-child relationships to improve visual appearance.

## SHOULD
- Use span links for causally related work that is not a strict parent-child relationship.
- Prefer fewer high-signal spans over dense low-value traces.

## Exceptions
Exceptions require documented diagnostic need, expected volume, overhead assessment, and a verification plan.

## Verification
Inspect representative traces for stable names, correct kinds, duration accuracy, parentage, links, and missing-end conditions; add automated instrumentation tests where possible.
