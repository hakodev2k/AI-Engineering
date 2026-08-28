# Demo Safety Rules

## Purpose
Prevent live or recorded demonstrations from creating avoidable security, privacy, cost, or reliability incidents.

## Scope
Applies to conference demos, livestreams, workshops, webinars, recordings, and public test environments.

## MUST
- Demo environments MUST be isolated from production unless explicit approval authorizes production observation.
- Credentials, tokens, customer data, private URLs, and administrative interfaces MUST be excluded from visible surfaces.
- External calls that can incur material cost or trigger irreversible actions MUST use bounded test accounts or approved safeguards.
- A fallback path MUST exist for high-visibility demos whose failure would materially affect the event.

## MUST NOT
- MUST NOT disable security controls solely to make a demo easier.
- MUST NOT expose real user data in screenshots, terminals, logs, or recordings.
- MUST NOT perform unreviewed production changes during a presentation.

## SHOULD
- Demo datasets SHOULD be synthetic and resettable.
- Presenters SHOULD rehearse network, quota, permission, and failure scenarios.

## Exceptions
Any production-connected demonstration requires documented purpose, risk review, access boundaries, and human approval.

## Verification
Inspect environment configuration, visible screens, account permissions, data sources, cost limits, fallback material, and rehearsal evidence.