# Memory Conflict Resolution Rules

## Purpose
Resolve contradictory memories without hiding uncertainty or corrupting higher-authority knowledge.

## Scope
Conflicts, duplicates, supersession, authority, reconciliation, and ambiguity.

## MUST
- Conflicting memories MUST be detected when they share subject and incompatible claims.
- Resolution MUST use explicit precedence signals such as source authority, temporal validity, verification state, and scope.
- Unresolved conflicts MUST remain distinguishable from resolved truth.
- Material conflict resolution MUST preserve provenance of competing records.

## MUST NOT
- MUST NOT use last-write-wins by default for semantically conflicting facts.
- MUST NOT discard contradictory evidence solely to simplify retrieval.
- MUST NOT let model confidence override authoritative source evidence.

## SHOULD
- Prefer reversible reconciliation strategies.
- Escalate conflicts affecting identity, permissions, safety, money, or regulated data.

## Exceptions
Exceptions require documented precedence rationale and risk review.

## Verification
Review conflict fixtures, reconciliation logs, precedence tests, and sampled ambiguous cases.