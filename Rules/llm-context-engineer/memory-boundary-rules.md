# Memory Boundary Rules

## Purpose
Keep conversational and persistent memory inside the correct scope and authority boundary.

## Scope
Session memory, persistent memory, user preferences, project memory, shared workspaces, and memory retrieval.

## MUST
- Memory MUST be scoped to the correct user, workspace, project, or session.
- Memory retrieval MUST apply access checks before content enters context.
- Persistent memory MUST distinguish user-provided facts from model-generated interpretations.
- Memory items MUST retain origin, scope, and update metadata when persistence affects future decisions.
- Current explicit instructions MUST take precedence over stale remembered preferences.

## MUST NOT
- MUST NOT mix memory between unrelated users, tenants, projects, or sessions.
- MUST NOT persist restricted content unless the product policy explicitly permits it.
- MUST NOT treat inferred preferences as authoritative facts.
- MUST NOT allow remembered context to override newer authoritative information.

## SHOULD
- Prefer narrowly scoped memory over broad global memory.
- Review or expire memory whose usefulness is time-bound.

## Exceptions
Exceptions require documented scope, access controls, and verification.

## Verification
Review access tests, isolation tests, memory provenance, conflict tests, and retention settings.