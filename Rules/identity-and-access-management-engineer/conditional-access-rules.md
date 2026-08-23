# Conditional Access Rules

## Purpose
Apply context-aware access controls without weakening baseline identity assurance.

## Scope
Device posture, network context, location, risk signals, session controls, and step-up authentication.

## MUST
- Conditional access policies MUST have documented intent, scope, exclusions, and failure behavior.
- High-risk sign-ins MUST trigger controls appropriate to the detected risk.
- Policy exclusions MUST be minimal, attributable, reviewed, and time-bounded where possible.
- Changes MUST be tested against critical user, service, and emergency-access scenarios before broad enforcement.
- Required policy signals MUST have defined freshness and trust expectations.

## MUST NOT
- MUST NOT use conditional access as a substitute for basic authorization or least privilege.
- MUST NOT create broad permanent bypass groups for convenience.
- MUST NOT enforce policies that can lock out all emergency administrative access without tested recovery paths.

## SHOULD
- Policies SHOULD be deployed progressively using report-only or equivalent evaluation modes when available.
- Device trust and phishing-resistant authentication SHOULD be combined for high-value access.

## Exceptions
Require owner, business reason, risk, compensating controls, expiry, and approval.

## Verification
Inspect policy configuration, exclusions, simulation/report-only results, sign-in logs, emergency-access tests, and exception reviews.