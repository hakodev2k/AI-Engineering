# Fault Containment Rules

## Purpose
Prevent local timing or component failures from cascading across the system.

## Scope
Fault domains, isolation, watchdogs, degraded modes, restart boundaries, and recovery behavior.

## MUST
- Critical components MUST define their fault-containment boundary and dependencies.
- Deadline misses, hangs, and resource exhaustion MUST have bounded detection and recovery behavior where recovery is required.
- Recovery actions MUST preserve data integrity and higher-criticality functions.
- Watchdog configuration MUST be derived from timing evidence rather than arbitrary thresholds.

## MUST NOT
- MUST NOT restart or reset shared infrastructure automatically when the action can amplify failure without a bounded impact analysis.
- MUST NOT allow a lower-criticality failure to monopolize recovery resources needed by critical functions.

## SHOULD
- Prefer localized recovery before system-wide restart when isolation is trustworthy.

## Exceptions
Exceptions require failure-mode analysis, rollback or safe-state strategy, and accountable approval.

## Verification
Run fault injection, watchdog tests, dependency-loss tests, recovery timing measurements, and state-integrity checks.