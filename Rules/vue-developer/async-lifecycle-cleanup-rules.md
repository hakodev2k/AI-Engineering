# Async Lifecycle and Cleanup Rules

## Purpose
Prevent leaks, stale updates, duplicate side effects, and post-unmount work in Vue applications.

## Scope
Promises, timers, event listeners, observers, subscriptions, workers, sockets, and asynchronous component/composable work.

## MUST
- Resources with a lifecycle MUST have a clearly owned cleanup path.
- Async results MUST verify they are still relevant before mutating view state when inputs or component lifetime may have changed.
- Reconnection and retry loops MUST be bounded or back off and MUST stop when their owner is disposed.
- Global listeners and observers MUST be removed using the same identity/options used during registration.
- Long-lived streams MUST define ownership, unsubscribe behavior, and error handling.

## MUST NOT
- Unmounted components MUST NOT remain retained by avoidable listeners, timers, closures, or subscriptions.
- Async callbacks MUST NOT assume route/component identity is unchanged after awaiting external work.
- Background loops MUST NOT continue indefinitely after their feature is no longer active unless intentionally application-scoped.

## SHOULD
- Use AbortController or equivalent cancellation where supported by the underlying operation.
- Centralize process-lifetime resources rather than recreating them per component.

## Exceptions
Application-scoped connections may outlive views when ownership is explicit and shutdown/reconnect policy is centrally managed.

## Verification
Mount/unmount repeatedly, inspect listener/subscription counts and memory profiles, simulate slow responses, and test route changes during pending work.