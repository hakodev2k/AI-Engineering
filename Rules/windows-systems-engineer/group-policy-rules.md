# Group Policy

## Purpose
Make policy enforcement controlled, testable, and recoverable.

## Scope
GPO design, linking, inheritance, filtering, administrative templates, security policy, and preferences.

## MUST
- Every material GPO change MUST identify target scope, precedence, expected settings, and rollback method.
- Security-sensitive or broad-scope GPO changes MUST be tested on representative systems before wide rollout.
- GPO ownership and purpose MUST be discoverable.
- Changes affecting authentication, firewall, encryption, update, or privilege controls MUST require human approval before production rollout.

## MUST NOT
- MUST NOT disable inheritance or use enforcement without documenting why normal precedence is insufficient.
- MUST NOT use broad security filtering as a substitute for deliberate targeting.
- MUST NOT store reusable secrets in Group Policy Preferences or scripts.

## SHOULD
- Keep GPOs cohesive by policy domain and avoid unnecessary setting duplication.
- Stage high-impact changes through controlled organizational units or rings.

## Exceptions
Exceptions require scope, reason, evidence, risk, rollback, and approval.

## Verification
Inspect resultant set of policy, GPO reports, links, filters, event logs, registry/effective settings, and representative endpoint behavior before declaring success.