# Application Lifecycle Rules
## Purpose
Preserve correctness across launch, foreground, background, suspension, termination, and restoration.
## Scope
Application lifecycle events, scene/activity lifecycle, background transitions, state restoration, and interrupted work.
## MUST
- Critical transient state MUST have an explicit persistence or recovery strategy before lifecycle termination can lose it.
- Lifecycle handlers MUST be idempotent where repeated callbacks are possible.
- Long-running work MUST respect platform background execution limits.
## MUST NOT
- Correctness MUST NOT depend on a graceful shutdown callback being delivered.
- UI-bound resources MUST NOT be retained after their owning lifecycle ends.
## SHOULD
- Restoration SHOULD resume user intent without replaying destructive side effects.
## Exceptions
Ephemeral presentation-only state may be discarded when loss has no user or data consequence.
## Verification
Exercise cold start, warm start, background/foreground, process death, restoration, and interrupted-operation tests on supported platforms.