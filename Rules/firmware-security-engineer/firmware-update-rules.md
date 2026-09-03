# Firmware Update Rules

## Purpose
Ensure firmware updates preserve authenticity, integrity, compatibility, recoverability, and security policy throughout the device lifecycle.

## Scope
Applies to local, remote, staged, factory, recovery, and field update mechanisms.

## MUST
- Authenticate update packages before installation and before any executable content is trusted.
- Validate product identity, hardware compatibility, version policy, package integrity, and required dependencies before committing an update.
- Design interruption-safe installation or provide a verified recovery mechanism for power loss and partial writes.
- Record update outcome and security-relevant failures without exposing secrets.

## MUST NOT
- Install unsigned or unverifiable production firmware to bypass an update failure.
- Accept update metadata from an unauthenticated source when it influences trust or target selection.
- Leave a device permanently unbootable because a normal update was interrupted.

## SHOULD
- Stage risky updates gradually and support health verification before broad rollout.
- Keep update logic small enough to audit and test comprehensively.

## Exceptions
Emergency procedures require documented scope, threat assessment, compensating controls, rollback or recovery plan, explicit approval, and post-event review.

## Verification
Test valid, malformed, incompatible, interrupted, replayed, and tampered packages; inspect logs and state transitions; verify successful recovery and rejection behavior.