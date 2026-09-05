# Local Cache and State Rules

## Purpose
Prevent stale, unbounded, or cross-context local state from corrupting edge inference behavior.

## Scope
Feature caches, embeddings, model outputs, session state, local indexes, and derived intermediate data.

## MUST
- Cache keys MUST include all dimensions required to prevent incorrect reuse across users, models, or configurations.
- Cache lifetime and size MUST be bounded.
- State invalidation MUST occur when incompatible model or preprocessing versions activate.
- Sensitive cached state MUST follow project retention and protection requirements.

## MUST NOT
- MUST NOT reuse cached outputs across incompatible model versions.
- MUST NOT allow caches to grow without an explicit bound.

## SHOULD
- Prefer deterministic invalidation rules over heuristic cleanup for correctness-sensitive state.

## Exceptions
Require documented reuse semantics, risk, evidence, and approval.

## Verification
Inspect cache keys, eviction settings, version invalidation tests, storage growth tests, and privacy controls.