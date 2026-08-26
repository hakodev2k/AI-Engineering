# Tamper Resistance Rules

## Purpose
Use tamper resistance as defense in depth without confusing it with authoritative security enforcement.

## Scope
Obfuscation, integrity checks, anti-debug controls, device integrity signals, runtime hardening, and abuse resistance.

## MUST
- Define the attacker capability and security objective before adding tamper-resistance controls.
- Keep authoritative authorization, entitlement, and integrity decisions outside attacker-controlled client state.
- Design server behavior to remain safe when client tamper controls are bypassed.
- Measure operational impact and false positives for device-integrity controls.

## MUST NOT
- Represent obfuscation or anti-debugging as a substitute for authentication, authorization, cryptography, or server validation.
- Block legitimate users solely on weak integrity signals without a documented risk policy.
- Embed durable secrets merely because code is obfuscated.

## SHOULD
- Layer controls according to asset value and observed abuse.
- Keep enforcement responses reversible where false positives can harm users.

## Exceptions
Strong client restrictions require documented threat evidence, user impact, support path, and approval.

## Verification
Review architecture assumptions, attempt controlled client modification, inspect server validation, and evaluate false-positive/false-negative evidence.