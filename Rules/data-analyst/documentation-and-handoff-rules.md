# Documentation and Handoff Rules

## Purpose
Preserve analytical context so results remain maintainable after ownership changes.

## Scope
Recurring analyses, dashboards, models, metrics, and decision-support artifacts.

## MUST
- Document purpose, owner, sources, transformations, metric definitions, refresh behavior, and known limitations for governed outputs.
- Record non-obvious business rules and manual dependencies.
- Identify upstream and downstream dependencies for critical reporting.
- Update documentation when material logic changes.

## MUST NOT
- MUST NOT leave critical recurring analysis dependent on undocumented personal knowledge.
- MUST NOT document obsolete logic as current.

## SHOULD
- Keep documentation close to the governed analytical asset and version it with material changes.

## Exceptions
Short-lived exploratory work may use lightweight notes if it is not promoted to recurring use.

## Verification
Inspect asset documentation, ownership, change history, dependency references, and whether another qualified analyst can reproduce the output.