# Schema Compatibility Rules

## Purpose
Protect consumers from accidental breakage as data contracts evolve.

## Scope
Applies to structural changes in schemas, records, messages, files, tables, and typed interfaces consumed by other systems.

## MUST
- Every schema change MUST be classified as backward-compatible, conditionally compatible, or breaking before release.
- Required fields MUST NOT be added without a migration strategy for existing producers and consumers.
- Field removals, renames, type narrowing, semantic repurposing, and incompatible enum changes MUST be treated as breaking unless proven otherwise.
- Compatibility expectations MUST be encoded in automated checks where tooling permits.

## MUST NOT
- A producer MUST NOT deploy a breaking schema change without approved consumer migration sequencing.
- Existing fields MUST NOT silently change meaning while retaining the same name.
- Compatibility MUST NOT be judged only from syntax when semantics or nullability behavior also changes.

## SHOULD
- Prefer additive evolution and deprecation windows over coordinated big-bang changes.
- Prefer tolerant readers only when they do not hide contract violations.

## Exceptions
Exceptions require affected-consumer analysis, rollback or containment strategy, explicit approval, and evidence that no safer compatible path is practical.

## Verification
Run schema-diff and compatibility tooling, inspect generated consumer bindings where relevant, execute contract tests, and review documented consumer impact.