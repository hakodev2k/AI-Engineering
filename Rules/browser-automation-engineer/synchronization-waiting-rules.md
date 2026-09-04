# Synchronization and Waiting Rules

## Purpose
Prevent race conditions and non-deterministic browser automation by synchronizing on meaningful application state.

## Scope
Applies to navigation, rendering, asynchronous requests, animations, background work, downloads, uploads, and dynamic UI transitions.

## MUST
- Automation MUST wait for an observable condition that represents readiness for the next action.
- Readiness conditions MUST be bounded by explicit timeouts with diagnostic failures.
- Navigation and request-dependent flows MUST distinguish document readiness from application-level readiness.
- Synchronization failures MUST preserve evidence sufficient to determine what condition remained unsatisfied.
- Polling MUST use bounded intervals and termination conditions.

## MUST NOT
- Fixed-duration sleeps MUST NOT be the primary synchronization mechanism.
- Timeouts MUST NOT be increased repeatedly without evidence that the underlying operation legitimately requires more time.
- Automation MUST NOT assume that an element being present means it is actionable, stable, or backed by completed application state.

## SHOULD
- Prefer event, response, URL, state, locator, or application-specific readiness conditions over elapsed time.
- Animation-dependent interactions SHOULD disable nonessential motion in controlled test environments when representative behavior is preserved.

## Exceptions
A deliberate fixed wait may be used only when the behavior being validated is itself time-based or no observable completion signal exists; document the reason and bound the wait.

## Verification
Inspect waits during code review, run workflows under slow network and CPU conditions, repeat affected scenarios, and verify timeout errors identify the unmet condition rather than only reporting elapsed time.