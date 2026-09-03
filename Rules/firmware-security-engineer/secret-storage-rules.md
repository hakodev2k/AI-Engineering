# Secret Storage Rules

## Purpose
Protect long-lived credentials and sensitive security state against extraction, unauthorized modification, and accidental disclosure.

## Scope
Applies to keys, credentials, tokens, counters, recovery material, protected configuration, and sensitive manufacturing state.

## MUST
- Classify sensitive values and select storage protection based on confidentiality, integrity, lifetime, and attacker access.
- Authenticate security-critical mutable state before trusting it.
- Restrict secret access to the smallest firmware component and privilege level that requires it.
- Define secure erasure or retirement behavior where the platform can provide meaningful deletion guarantees.

## MUST NOT
- Store plaintext production secrets in generally readable flash, logs, crash dumps, or diagnostic exports.
- Duplicate secrets across storage regions without a documented security and recovery reason.
- Assume memory-mapped storage is protected merely because it is not exposed through the normal application interface.

## SHOULD
- Use hardware-backed storage and access controls where available and appropriate.
- Minimize secret residency in general-purpose memory.

## Exceptions
Alternative storage requires documented threat analysis, exposure duration, compensating controls, and security approval.

## Verification
Inspect memory maps and access policy, review dumps and diagnostics, exercise read/write attacks, and validate integrity and confidentiality controls on representative hardware.