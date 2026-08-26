# Unsubscribe Rules

## Purpose
Make opt-out reliable, low-friction, auditable, and resistant to accidental resubscription.

## Scope
Unsubscribe links, one-click mechanisms, preference endpoints, suppression propagation, and resubscription.

## MUST
- Applicable promotional mail MUST provide a functional unsubscribe mechanism appropriate to receiver and regulatory requirements.
- Unsubscribe requests MUST update authoritative suppression state within the required processing window.
- Automated one-click unsubscribe endpoints MUST validate the intended protocol while avoiding unnecessary user friction.
- Resubscription after suppression MUST require a new, attributable affirmative action where applicable.
- Failures in unsubscribe processing MUST be observable and operationally actionable.

## MUST NOT
- MUST NOT require login, payment, or unnecessary data entry to honor a standard promotional opt-out.
- MUST NOT continue normal promotional sends after confirmed suppression propagation.
- MUST NOT silently recreate subscriptions from stale downstream data.

## SHOULD
- Keep unsubscribe endpoints highly available and independent from nonessential application dependencies.
- Test links and headers before high-volume sends.

## Exceptions
Exceptions apply only where the message category is legitimately exempt; classification and rationale must be documented and reviewable.

## Verification
Exercise unsubscribe flows end to end, inspect message headers and links, verify authoritative state and downstream propagation, and test that subsequent audience generation excludes the recipient.