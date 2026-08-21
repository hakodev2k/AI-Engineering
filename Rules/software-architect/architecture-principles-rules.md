# Architecture Principles Rules

## Purpose
Keep software architecture coherent, explainable, and aligned with system constraints over time.

## Scope
Applies to structural decisions, architectural styles, cross-cutting patterns, and system-wide technical direction.

## MUST
- Architecture decisions MUST trace to explicit functional or non-functional requirements.
- Significant structural choices MUST document constraints, trade-offs, and rejected alternatives.
- Architecture MUST optimize for the system's actual change drivers rather than pattern popularity.
- Decisions with broad blast radius MUST define migration, compatibility, and rollback implications.

## MUST NOT
- MUST NOT introduce architectural patterns solely for consistency with trends or personal preference.
- MUST NOT hide unresolved trade-offs behind vague labels such as scalable, clean, or enterprise-ready.
- MUST NOT treat architecture diagrams as evidence that implementation boundaries are actually enforced.

## SHOULD
- Prefer the simplest architecture that satisfies current constraints while preserving reasonable evolution paths.
- Prefer reversible decisions where uncertainty is high.

## Exceptions
Exceptions require documented context, evidence, risks, and explicit review when the deviation affects multiple modules or teams.

## Verification
Review ADRs, architecture tests, dependency graphs, module ownership, runtime behavior, and implementation diffs.