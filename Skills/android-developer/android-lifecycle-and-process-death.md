# Android Lifecycle and Process Death

## Purpose
Make Android features correct across configuration change, backgrounding, task recreation, and process death instead of relying on in-memory continuity.

## When to use
Use for screens with user input, navigation state, long-running work, pending actions, or data that must survive recreation.

## Inputs
Activity/Fragment/Compose lifecycle behavior, navigation model, saved state, persistent storage, pending operations, acceptance criteria.

## Preconditions
Separate recoverable UI state from durable business data.

## Context to inspect
ViewModels, SavedStateHandle, rememberSaveable, intents, navigation arguments, WorkManager, repositories, persistence, callbacks, and singleton caches.

## Core knowledge
ViewModels survive configuration changes but not process death. Saved state is size-constrained and intended for reconstruction metadata, not arbitrary datasets. Durable work and business facts belong in persistent storage or managed background execution.

## Procedure
1. Classify state by lifetime: composition, screen, task, process-independent.
2. Identify assumptions that require the process to remain alive.
3. Persist business facts before acknowledging completion.
4. Save only minimal reconstruction state.
5. Rehydrate screen state from durable sources.
6. Make pending actions idempotent where replay is possible.
7. Ensure navigation arguments can reconstruct required context.
8. Test rotation, background/foreground, task removal, and process recreation.
9. Check duplicate callbacks and stale references.
10. Document any intentionally non-restored transient state.

## Decision points
Use SavedStateHandle for small reconstruction inputs; use database/files for durable data; use WorkManager for deferrable guaranteed work.

## Common failure patterns
Treating ViewModel as persistence, storing large objects in bundles, duplicate submissions after recreation, stale Activity references, and restoring UI without revalidating data.

## Verification
Force process death using developer tools or controlled test scenarios and verify reconstruction, no duplicate side effects, and consistent persisted state.

## Expected output
State-lifetime map, persistence/restoration design, lifecycle-safe implementation, and recreation test evidence.

## Stop conditions
Escalate when product requirements for restoration are contradictory or when an external side effect cannot be made safely replayable.