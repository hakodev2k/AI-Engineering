# Graceful Degradation and Safe Fallbacks

## Purpose
Keep AI services useful during partial failures without silently violating quality, safety, security, or data-handling expectations.

## When to use
Use when designing degraded modes for model outages, retrieval failures, tool unavailability, overloaded systems, or dependency incidents.

## Inputs
Critical capabilities, fallback models, cached data, feature flags, risk classification, minimum acceptable quality, user experience requirements.

## Preconditions
Fallback behaviors can be independently tested and activated reversibly.

## Context to inspect
Model routing, RAG dependencies, tool permissions, cached responses, feature toggles, human-review paths, user messaging.

## Core knowledge
Graceful degradation should remove risky capability before it fabricates confidence. For example, disabling external actions or clearly marking unavailable grounding can be safer than returning apparently normal but unreliable results.

## Procedure
1. Rank capabilities by criticality and failure consequence.
2. Define minimum viable safe behavior for each failure mode.
3. Identify which features can be disabled independently.
4. Validate alternate models or providers against contracts.
5. Define read-only or human-approval modes for agentic actions.
6. Prevent stale or unauthorized caches from becoming fallbacks.
7. Make degraded behavior observable to users and operators where appropriate.
8. Test activation and restoration paths.
9. Monitor quality, safety, latency, and cost while degraded.
10. Document recovery gates.

## Decision points
Prefer explicit unavailability over misleading output when grounding or authorization guarantees cannot be maintained. Use lower-capability fallback only when task risk permits it.

## Common failure patterns
Failing open, hiding degraded state, using unvalidated fallback models, retaining write tools while reasoning quality is degraded, and restoring all capabilities at once.

## Verification
Chaos tests prove each degraded mode activates correctly, preserves required boundaries, and returns to normal without stale state.

## Expected output
A degradation matrix mapping failures to safe fallback behavior, controls, observability, and recovery criteria.

## Stop conditions
Escalate when no fallback can preserve mandatory safety, security, privacy, or contractual requirements.