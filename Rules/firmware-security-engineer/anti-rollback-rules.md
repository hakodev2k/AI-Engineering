# Anti-Rollback Rules

## Purpose
Prevent installation or execution of firmware versions that reintroduce known security weaknesses.

## Scope
Applies to production boot verification, update policy, recovery images, security version counters, and downgrade procedures.

## MUST
- Define which firmware security versions remain acceptable for each supported device generation.
- Enforce downgrade protection using authenticated, tamper-resistant state appropriate to the threat model.
- Advance irreversible security counters only after the target image has passed required validation and recovery implications are understood.
- Treat rollback policy changes as security-sensitive configuration changes.

## MUST NOT
- Permit unrestricted downgrade in production solely for troubleshooting convenience.
- Store authoritative anti-rollback state only in attacker-writable unauthenticated storage.
- Burn irreversible version state before confirming that supported recovery paths remain valid.

## SHOULD
- Separate semantic product versioning from security rollback versioning.
- Retain an approved emergency recovery process that does not silently weaken production policy.

## Exceptions
A downgrade exception requires explicit security approval, bounded devices and duration, evidence of necessity, compensating controls, and a restoration plan.

## Verification
Attempt approved and prohibited downgrade paths, tamper with version metadata, test interrupted upgrades, and inspect enforcement at both update and boot boundaries.