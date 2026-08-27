# Trigger Architecture Rules

## Purpose
Keep trigger behavior deterministic, composable, and reviewable.

## Scope
Applies to Apex triggers and the services they invoke.

## MUST
- Each object MUST have a clear trigger orchestration strategy.
- Trigger handlers MUST separate before/after and insert/update/delete/undelete responsibilities.
- Recursion prevention MUST be based on explicit transaction behavior, not fragile global flags alone.
- Trigger order dependencies MUST be documented when multiple automation mechanisms interact.

## MUST NOT
- MUST NOT embed substantial business logic directly in trigger bodies.
- MUST NOT assume execution order across unrelated automation unless guaranteed and documented.
- MUST NOT suppress legitimate second-pass processing through blanket static booleans.

## SHOULD
- Trigger handlers SHOULD delegate to cohesive domain or service components.
- Cross-object side effects SHOULD be minimized and explicitly tested.

## Exceptions
Exceptions require a documented platform constraint and review of recursion and ordering risks.

## Verification
Inspect trigger bodies, execution logs, recursion tests, mixed-operation tests, and automation inventory.