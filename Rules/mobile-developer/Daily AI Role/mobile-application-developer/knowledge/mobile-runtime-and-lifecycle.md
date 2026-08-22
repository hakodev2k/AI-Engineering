# Knowledge: Mobile Runtime and Lifecycle

Mobile software is controlled partly by the OS. A professional implementation assumes interruption.

## Core invariants
- Foreground, inactive, background, suspended/terminated, and recreated states can interrupt work.
- Process memory is not durable state.
- Background execution is constrained and platform/version dependent.
- Network reachability does not guarantee request success; a timeout does not prove the server did nothing.
- Device clocks, storage, memory, battery, locale, accessibility settings and screen size vary.
- App upgrades may encounter persisted data from many prior versions.
- Push/deep-link entry can bypass the normal navigation path; authorization and state restoration still apply.

## State categories
Ephemeral UI state; durable local user state; remote authoritative state; cache; queued mutation; derived state. Do not mix these categories implicitly.

## Design consequences
Make important operations resumable or safely restartable. Persist only what has clear ownership/retention. Use idempotency for retried remote mutations. Validate every external navigation input. Treat permission denial/revocation as normal states. Test upgrade, process death, offline transitions and delayed callbacks.

## Platform abstraction rule
Keep product/business rules tool-neutral. Isolate iOS/Android/framework adapters for permissions, background work, storage, notifications, deep links, signing and store-specific behavior.