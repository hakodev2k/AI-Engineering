# Evaluation Consistency Rules

## Purpose
Prevent contradictory flag decisions across requests, services, sessions, and replicas.

## Scope
Distributed flag evaluation and propagation.

## MUST
- Consistency requirements MUST be defined per flag based on user and system impact.
- Sticky experiences MUST use stable subject keys and deterministic allocation.
- Cross-service workflows that require one decision MUST propagate or correlate that decision rather than independently reevaluate under changing state.
- Propagation delay assumptions MUST be documented and tested.

## MUST NOT
- Services MUST NOT assume instantaneous global flag updates.
- Random allocation MUST NOT cause a subject to oscillate between variants when stickiness is required.
- Identity key changes MUST NOT silently reshuffle high-impact cohorts.

## SHOULD
- Evaluation context SHOULD be versioned or traceable for investigations.

## Exceptions
Eventual inconsistency is acceptable only when bounded impact is documented.

## Verification
Use multi-replica tests, allocation fixtures, propagation measurements, and distributed traces.