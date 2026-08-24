# UI State and Lifecycle Rules

## Purpose
Ensure UI behavior remains correct across recomposition, recreation, navigation, and process loss.

## Scope
Applies to Activities, Fragments, Compose UI, view models, saved state, and lifecycle-aware collection.

## MUST
- Separate durable/domain state from transient presentation state and define restoration expectations.
- Collect observable state using lifecycle-aware mechanisms appropriate to the UI framework.
- Make one-time effects explicitly consumable or event-driven rather than encoding them as replayable durable state.
- Verify critical flows across configuration change and process recreation where user impact warrants it.

## MUST NOT
- Retain Activity, Fragment, View, or other short-lived context references in longer-lived objects.
- Trigger non-idempotent business actions merely because UI code recomposes or rebinds.
- Treat in-memory UI state as durable user data.

## SHOULD
- Expose immutable UI state with explicit events/actions.
- Keep rendering deterministic for a given state.
- Minimize lifecycle-specific branching in domain logic.

## Exceptions
Non-restorable state must be intentionally classified as disposable and must not represent committed user work.

## Verification
Use lifecycle/recreation tests, Compose/UI tests, leak detection, manual process-death checks for critical flows, and code review of state/effect ownership.