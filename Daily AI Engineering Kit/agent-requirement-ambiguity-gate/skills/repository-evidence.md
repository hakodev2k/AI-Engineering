# Repository Evidence Skill

## Purpose
Gather the minimum repository evidence needed to resolve requirement ambiguity without loading unrelated context.

## Inputs
Task statement, candidate components, current contract.

## Process
1. Inspect top-level structure and identify likely entry points.
2. Search exact domain terms, endpoint names, types, configuration keys, table/entity names, and test names.
3. Read the narrowest relevant implementation and its callers/callees.
4. Locate public API/schema contracts and persistence boundaries affected by the request.
5. Read nearby tests to discover existing behavior and invariants.
6. Run a targeted non-destructive test/build only if it establishes current behavior.
7. Record source plus concrete finding; distinguish current fact from interpretation.
8. Expand to another module only when current evidence creates a dependency or unanswered question.

## Evidence quality
Prefer executable tests and current source over comments; current configuration over assumptions; official documentation over third-party summaries. A failing test is evidence only after confirming it represents current intended behavior.

## Expected output
Evidence entries containing `source` and `finding`, plus new assumptions/questions discovered.

## Verification
Each material scope or acceptance decision has at least one traceable source when repository evidence can establish it.

## Failure handling
For conflicting sources, preserve both and mark the requirement blocked until precedence is established. Never silently choose the convenient source.

## Stop conditions
Stop exploration when all material decision questions are answered or when further progress requires unavailable permissions/business input.
