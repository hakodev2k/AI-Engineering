# Session Risk Rules

## Purpose
Continuously control authenticated sessions when risk changes after initial login.

## Scope
Applies to web sessions, API tokens, administrative sessions, remote access, and long-running interactive access.

## MUST
- Session lifetime MUST reflect resource sensitivity and credential strength.
- Material changes in user, device, network, threat, or privilege context MUST trigger re-evaluation.
- High-risk sessions MUST support step-up authentication, privilege reduction, or termination.
- Revocation events MUST propagate within a defined maximum delay.

## MUST NOT
- MUST NOT treat successful login as permanent trust for the session lifetime.
- MUST NOT extend sensitive sessions indefinitely through passive activity alone.
- MUST NOT expose reusable session artifacts in logs, URLs, or analytics systems.

## SHOULD
- Session binding SHOULD resist replay across devices or contexts where practical.
- Risk decisions SHOULD preserve enough evidence for later investigation.

## Exceptions
Long-lived sessions require documented operational need, stronger compensating controls, explicit expiry, owner, and approval.

## Verification
Test session expiry, revocation, context changes, step-up flows, privilege changes, replay resistance, and audit records using representative identities and threat scenarios.