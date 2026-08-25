# Session-Aware Personalization

## Purpose
Use recent in-session behavior to adapt recommendations while preserving predictable serving performance.

## When to use
Use when short-term intent differs materially from long-term preference profiles.

## Inputs
Recent interaction events, session context, online features, model interface, freshness target, and latency target.

## Context to inspect
Event ordering, state lifetime, feature availability, cache layers, and fallback behavior.

## Core knowledge
Session signals can capture transient intent without requiring continual model retraining. Freshness must be balanced against serving complexity and latency.

## Procedure
1. Measure whether recent interactions predict near-term choices.
2. Select signals available before each recommendation decision.
3. Define session boundaries, ordering, and state lifetime.
4. Compute only the online state needed for retrieval or ranking.
5. Bound synchronous reads and computation.
6. Define behavior for stale or missing state.
7. Load-test end-to-end serving.
8. Monitor freshness, errors, and incremental quality.

## Decision points
Prefer lightweight online features when they capture enough intent; retrain or adapt model parameters only when evidence shows additional value.

## Common failure patterns
Unbounded state, duplicate event effects, excessive synchronous dependencies, stale caches, and complexity without measured lift.

## Verification
Replay representative sessions, test delayed and duplicate events, measure tail latency, and compare against a long-term-profile baseline.

## Expected output
A bounded session-personalization design with measured value and fallback behavior.

## Stop conditions
Stop when serving latency cannot meet targets or event semantics are too unreliable for consistent session state.