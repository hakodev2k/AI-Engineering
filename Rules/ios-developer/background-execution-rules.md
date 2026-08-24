# Background Execution Rules

## Purpose
Make background work compatible with iOS scheduling, termination, energy, and retry constraints.

## Scope
BackgroundTasks, background URLSession, processing tasks, refresh, notifications, and finite background time.

## MUST
- Background work MUST assume suspension or termination can occur at any time.
- Work MUST be idempotent or have durable progress semantics when it may be retried.
- Completion handlers MUST be called exactly as required by platform contracts.
- Tasks MUST respect expiration/cancellation signals and persist necessary progress safely.
- Background modes and entitlements MUST be enabled only for legitimate product behavior.

## MUST NOT
- MUST NOT use background modes to simulate unrestricted continuous execution.
- MUST NOT depend on exact background scheduling time unless the platform contract guarantees it.
- MUST NOT perform unnecessary polling when push, scheduled, or event-driven mechanisms are available.

## SHOULD
- Batch network and disk work to reduce wakeups.
- Design user-visible state to tolerate delayed background execution.

## Exceptions
Exceptional background privileges require documented platform eligibility, product need, energy impact, and approval.

## Verification
Test expiration, process termination, retries, offline transitions, background URLSession relaunch, energy impact, and entitlement configuration on real devices.