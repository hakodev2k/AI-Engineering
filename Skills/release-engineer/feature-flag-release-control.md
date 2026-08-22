# Feature Flag Release Control

## Purpose
Decouple code deployment from feature exposure so risky behavior can be enabled, measured, or disabled without rebuilding software.

## When to use
Use for gradual launches, operational kill switches, experiments, entitlement rollout, or incomplete cross-release transitions.

## Inputs
Flag platform, target cohorts, release behavior, default state, ownership, telemetry, dependencies, and cleanup date.

## Preconditions
Both flag states are safe and tested for the intended transition period.

## Context to inspect
Inspect flag evaluation path, caching, defaults during provider outage, authorization implications, data writes, configuration ownership, and existing stale flags.

## Core knowledge
Flags introduce runtime branches and operational state. Release flags should have clear owners and lifetimes. A flag is not a security boundary unless the authorization model independently enforces access.

## Procedure
1. Define the exact behavior controlled by the flag.
2. Choose a safe default and failure behavior.
3. Test enabled and disabled states.
4. Define targeting and rollout cohorts.
5. Add telemetry for evaluation and resulting behavior.
6. Restrict who can change production flag state.
7. Define emergency disable procedure.
8. Progress exposure based on evidence.
9. Confirm stable final behavior.
10. Remove flag and dead branch by a defined deadline.

## Decision points
Use flags when exposure needs independent control; avoid them for simple low-risk changes where branch complexity exceeds benefit. Use server-side evaluation for sensitive logic rather than trusting client-controlled flags.

## Common failure patterns
Flags never removed, untested disabled path, changing database semantics incompatibly between states, treating flags as authorization, provider outage changing defaults unexpectedly, and no audit history.

## Verification
Test both states and provider failure, confirm cohort targeting, audit production changes, and verify cleanup after rollout.

## Expected output
A governed feature flag with safe defaults, telemetry, rollout rules, and removal plan.

## Stop conditions
Stop if either state can corrupt data, flag changes are unaudited for high-impact behavior, or authorization relies solely on flag secrecy.