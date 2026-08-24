# App Lifecycle Resilience Rules

## Purpose
Preserve correctness across suspension, termination, restoration, scene changes, interruptions, and resource pressure.

## Scope
Application and scene lifecycle, state restoration, interruptions, memory pressure, and process relaunch.

## MUST
- Critical user work MUST define what is persisted before suspension or termination risk.
- Relaunch MUST tolerate partially completed non-atomic work and stale transient state.
- Multi-scene behavior MUST define ownership for shared and scene-specific state.
- Interruptions MUST leave media, transactions, editing, and other stateful flows in a recoverable condition.
- Restoration data MUST be validated before use.

## MUST NOT
- MUST NOT assume graceful termination callbacks will run.
- MUST NOT keep correctness-critical state only in memory when product requirements require recovery.
- MUST NOT let one scene accidentally mutate another scene's navigation or ephemeral state.

## SHOULD
- Persist compact domain state rather than entire UI object graphs.
- Make lifecycle transitions idempotent where callbacks may repeat.

## Exceptions
Non-restorable flows require explicit product acceptance and clear user recovery behavior.

## Verification
Force-kill during critical flows, background/foreground repeatedly, test multiple scenes, simulate memory pressure and interruptions, and validate restoration across app upgrades.