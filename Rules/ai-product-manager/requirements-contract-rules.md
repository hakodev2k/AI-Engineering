# Requirements and Contract Rules

## Purpose
Translate product intent into testable requirements without overstating probabilistic behavior.

## Scope
Applies to PRDs, acceptance criteria, API or workflow commitments, and externally communicated behavior.

## MUST
- Requirements MUST separate deterministic guarantees from probabilistic targets.
- Acceptance criteria MUST define observable outcomes, failure handling, and relevant quality thresholds.
- Public or contractual behavior MUST identify compatibility constraints before change.
- Requirements for model outputs MUST include unacceptable failure classes where material.

## MUST NOT
- MUST NOT use vague terms such as intelligent, accurate, safe, or reliable without measurable meaning.
- MUST NOT promise exact model behavior that cannot be technically guaranteed.
- MUST NOT approve breaking workflow or contract changes without explicit migration and stakeholder review.

## SHOULD
- Requirements SHOULD identify assumptions, dependencies, and non-functional constraints.
- Critical requirements SHOULD trace to evaluation or test evidence.

## Exceptions
Exceptions require documented ambiguity, risk, owner, and a plan to make the requirement testable before release.

## Verification
Review PRDs, acceptance criteria, external commitments, evaluation mapping, and compatibility plans.