# Production Memory Debugging

## Purpose
Systematically diagnose incidents where an AI system remembers the wrong thing, forgets needed information, retrieves another scope's data, or behaves inconsistently across sessions.

## When to use
Use for production incidents involving incorrect extraction, stale memories, missing memories, retrieval regressions, duplication, authorization failures, or deletion failures.

## Inputs
Incident description, request IDs, traces, safe metadata logs, memory records, provenance, model/index versions, deployment history, metrics.

## Preconditions
Protect user data during investigation and obtain appropriate production access before inspecting sensitive records.

## Context to inspect
End-to-end path from source interaction through extraction, persistence, indexing, retrieval, ranking, context assembly, cache, and final model response.

## Core knowledge
Memory failures can originate at any lifecycle stage. The visible wrong answer is not proof that retrieval failed: extraction may have persisted a bad fact, ranking may have omitted a correct record, or the model may have ignored correct context.

## Procedure
1. Define the observed versus expected behavior.
2. Identify the affected identity, scope, and time range using safe identifiers.
3. Reconstruct the memory lifecycle for the request.
4. Inspect extraction outputs and provenance.
5. Verify authoritative storage state.
6. Verify index and cache consistency.
7. Replay retrieval and ranking using original versions/configuration.
8. Inspect context actually sent to the model.
9. Correlate with deployments and data migrations.
10. Isolate the first stage where expected behavior diverges.
11. Mitigate with the smallest safe change.
12. Add a regression case and monitor recurrence.

## Decision points
Disable or bypass memory when incorrect context creates greater harm than temporary forgetfulness. Prefer rollback when a recent deploy has a clear causal link and rollback is safe.

## Common failure patterns
Debugging only the final prompt; inspecting current state instead of incident-time versions; changing multiple components simultaneously; exposing sensitive memory in logs; retrying without preserving evidence.

## Verification
Reproduce the failure before the fix when possible, prove the corrected behavior with the same case, run adjacent regression tests, and confirm production telemetry returns to expected ranges.

## Expected output
A root-cause record containing evidence, affected lifecycle stage, mitigation, permanent fix, and regression protection.

## Stop conditions
Stop and escalate when investigation requires unauthorized data access, destructive production changes, or evidence indicates a cross-tenant security incident.