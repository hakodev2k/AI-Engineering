# Acceptance Contract Rules

## MUST

- Create a structurally valid acceptance contract before non-trivial implementation.
- Give every required behavior a stable obligation ID.
- Separate source-backed facts, assumptions, ambiguities, non-goals, and approvals.
- Define verification evidence for every required obligation.
- Record contradictory evidence instead of silently reconciling it.
- Re-open the contract when implementation discovers a new material behavior.
- Require explicit human approval for breaking contracts, destructive data actions, schema changes, permission relaxation, production changes, secrets, and irreversible external side effects.
- Report `implemented` and `verified` as separate states.

## MUST NOT

- Invent stakeholder intent to resolve a blocking ambiguity.
- Begin risky implementation while a blocking ambiguity is open.
- Change public API/event/database behavior unless represented by an accepted obligation.
- Treat existing implementation as proof of intended behavior without corroborating evidence.
- Hide scope expansion inside implementation details.
- Mark an obligation verified without named evidence.
- Retry the same failed reasoning or tool action indefinitely.

## SHOULD

- Prefer the smallest contract that fully captures observable behavior.
- Reuse existing terminology from the source request and repository.
- Prefer deterministic validation for schema, missing fields, duplicate IDs, and unresolved statuses.
- Keep assumptions narrow and reversible.
- Make non-goals explicit when adjacent behavior could easily be changed accidentally.
- Map tests to obligation IDs in names, metadata, comments, or an evidence report when practical.
