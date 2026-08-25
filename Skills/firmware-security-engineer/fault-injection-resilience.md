# Fault Injection Resilience

## Purpose
Assess and harden security-critical firmware against realistic voltage, clock, reset, electromagnetic, and software-induced fault effects that could bypass checks or corrupt security state.

## When to use
Use for high-value physical threat models, secure boot/key operations, lifecycle transitions, counters, or investigation of anomalous hardware-dependent bypasses.

## Inputs
Threat model, target hardware, security-critical code paths, clock/power/reset architecture, hardware countermeasures, lab equipment constraints, and safety rules.

## Preconditions
Perform only on authorized lab hardware. Define acceptable physical attacker capability and avoid claiming resistance beyond tested classes.

## Context to inspect
Signature verification, privilege/lifecycle checks, key derivation, fuse programming, monotonic counters, branch/error paths, persistent writes, reset handlers, and hardware fault monitors.

## Core knowledge
Fault attacks aim to violate control/data integrity rather than break cryptography mathematically. Redundant checks help only when independent enough to resist a common fault. Persistent security state requires transactional handling under reset/brownout. Hardware monitors can reduce exposure but need verified configuration.

## Procedure
1. Identify checks whose bypass yields high-impact privilege or trust changes.
2. Define plausible fault classes, timing windows, and attacker access.
3. Review code for single-point conditional checks and unsafe fail-open errors.
4. Harden critical decisions with validated sequencing, redundant/inverse checks, and protected state where justified.
5. Configure voltage/clock/tamper monitors and safe reset behavior.
6. Make irreversible/persistent transitions atomic and verify post-write state.
7. Add randomized timing only as defense in depth, not primary assurance.
8. Instrument lab builds to correlate fault timing with outcomes without changing release logic materially.
9. Execute bounded campaigns on sacrificial devices.
10. Convert reproducible bypasses into fixes and regression/fault tests.

## Decision points
Invest heavily in fault resistance only when physical attacker value and product assurance justify cost. Hardware countermeasures are preferable for root keys/lifecycle state; software redundancy can strengthen remaining checks but has limits.

## Common failure patterns
Single boolean signature result controlling boot; duplicated checks optimized into one; brownout corrupting rollback state; fault monitor configured too late; error paths granting recovery privilege; claiming glitch resistance from a few manual tests.

## Verification
Review generated assembly for critical redundant checks, validate monitor configuration, run reset/brownout tests and scoped fault campaigns, and confirm failures lead to reset/deny rather than privileged execution or corrupted accepted state.

## Expected output
Fault threat assessment, hardened critical paths, lab evidence, configuration changes, and bounded assurance statement.

## Stop conditions
Stop when testing risks unsafe equipment/device behavior, requires specialized certification beyond scope, or threat assumptions demand invasive attacks not supported by the available lab.