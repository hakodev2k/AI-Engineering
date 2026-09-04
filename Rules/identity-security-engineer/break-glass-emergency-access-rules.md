# Break-Glass and Emergency Access Rules

## Purpose
Provide controlled recovery access when normal identity systems or administrative paths fail.

## Scope
Applies to emergency administrator accounts, recovery credentials, out-of-band access, and crisis privilege elevation.

## MUST
- Emergency access mechanisms MUST be limited in number, separately protected, and documented.
- Use of emergency access MUST generate immediate or near-immediate audit evidence and post-use review.
- Emergency credentials MUST be tested periodically without exposing them unnecessarily.
- Storage and recovery procedures MUST survive failure of the primary identity provider where that is the intended use case.
- After use, credentials or factors MUST be rotated or revalidated according to incident risk.

## MUST NOT
- Break-glass access MUST NOT be used for routine administration.
- Emergency identities MUST NOT depend solely on the same failure domain they are intended to bypass.
- Emergency access events MUST NOT be closed without reviewing why normal controls failed.

## SHOULD
- Require dual control for retrieval or use where operationally feasible.
- Monitor emergency identities for any unexpected sign-in attempt.

## Exceptions
Exceptions require explicit resilience rationale, risk analysis, owner, and approval.

## Verification
Inspect emergency-account configuration, storage controls, test records, alerting, post-use reviews, and recovery exercises.