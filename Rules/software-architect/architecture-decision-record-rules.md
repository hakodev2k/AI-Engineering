# Architecture Decision Record Rules

## Purpose
Make significant architecture decisions traceable, reviewable, and understandable over time.

## Scope
Applies to decisions with material impact on structure, dependencies, data, security, operations, compatibility, or cost.

## MUST
- Significant decisions MUST record context, constraints, selected option, trade-offs, and consequences.
- Superseded decisions MUST remain traceable to their replacements.
- Decision records MUST distinguish assumptions from verified evidence.
- Decisions with unresolved risk MUST identify owners and follow-up conditions.

## MUST NOT
- MUST NOT rewrite historical decisions to hide the context in which they were made.
- MUST NOT use ADRs as ceremonial approval without documenting alternatives and consequences.
- MUST NOT treat an ADR as permanent when its assumptions no longer hold.

## SHOULD
- Prefer concise records created near decision time.
- Prefer explicit status such as proposed, accepted, superseded, or deprecated.

## Exceptions
Minor local decisions may remain in code review when blast radius and long-term significance are low.

## Verification
Review ADR repository, links from implementation changes, assumption validation, and supersession chains.