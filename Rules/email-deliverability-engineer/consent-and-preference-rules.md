# Consent and Preference Rules

## Purpose
Ensure recipient permissions and preferences constrain sending behavior before deliverability optimization occurs.

## Scope
Subscriptions, preferences, consent evidence, lawful operational messages, opt-down choices, and channel eligibility.

## MUST
- Send eligibility MUST be derived from authoritative consent and preference state appropriate to the message purpose.
- Consent evidence MUST record source and sufficient context to support audit requirements.
- Preference changes MUST propagate within defined service objectives and fail safely when state is uncertain.
- Transactional exemptions MUST be narrowly classified by message purpose rather than used as a marketing bypass.
- Audience queries MUST respect current suppression and preference state at send time or through an equivalently safe snapshot.

## MUST NOT
- MUST NOT infer marketing consent from account creation, purchase, or unrelated terms unless explicitly supported by applicable requirements.
- MUST NOT override a valid opt-out to improve campaign metrics.
- MUST NOT relabel promotional content as transactional to avoid preference controls.

## SHOULD
- Offer granular preferences where they reduce unwanted mail without creating misleading complexity.
- Minimize duplicated consent state.

## Exceptions
Exceptions require documented basis, legal/compliance review where applicable, scope, expiry, and approval.

## Verification
Trace representative recipients from acquisition through eligibility evaluation, send event, preference change, and suppression. Inspect audit records and test fail-safe behavior.