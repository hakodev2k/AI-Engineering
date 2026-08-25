# Rules of Engagement Rules

## Purpose
Translate authorization into operational controls that prevent avoidable disruption and misunderstanding.

## Scope
Applies to engagement planning, communications, execution windows, safety boundaries, and incident coordination.

## MUST
- MUST define permitted hours, source addresses, notification model, prohibited actions, rate limits, emergency contacts, evidence retention, and stop criteria before testing.
- MUST identify production-sensitive systems and specify stricter controls for them.
- MUST establish a reliable kill-switch or contact path capable of stopping testing promptly.
- MUST record material deviations and obtain approval before continuing under changed conditions.
- MUST coordinate tests that may trigger incident response so defenders can distinguish authorized activity when required by the engagement model.

## MUST NOT
- MUST NOT improvise high-impact techniques that were not covered by the rules of engagement.
- MUST NOT assume availability impact is acceptable because a target is in scope.
- MUST NOT conceal operational incidents caused by testing.

## SHOULD
- SHOULD define test identities, traffic markers, and expected telemetry where these do not invalidate objectives.
- SHOULD rehearse stop procedures for high-risk engagements.

## Exceptions
Any exception requires explicit approval from the accountable system owner and engagement authority, with impact analysis and rollback or containment measures.

## Verification
Inspect the approved rules of engagement, communication records, source-address logs, test timestamps, deviations, and stop-event records. Confirm observed activity remained within agreed operational limits.