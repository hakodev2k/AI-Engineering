# Key Rotation and Revocation Rules

## Purpose
Limit exposure and preserve recoverability when keys age or are compromised.

## Scope
Rotation, replacement, revocation, retirement, and compromise response.

## MUST
- Define rotation and revocation procedures for every production key class.
- Support overlap or staged migration where immediate replacement would break valid traffic or data access.
- Treat suspected key compromise as an incident and identify all affected ciphertext, signatures, identities, and dependents.

## MUST NOT
- Rotate or revoke production trust anchors without validated dependency and rollback analysis.
- Leave superseded keys authorized beyond their documented transition window.

## SHOULD
- Automate routine rotation and continuously test emergency replacement procedures.

## Exceptions
Extended lifetimes require risk justification, compensating controls, expiry, and approval.

## Verification
Review key ages, revocation state, runbooks, dependency inventories, audit events, and rotation exercises.