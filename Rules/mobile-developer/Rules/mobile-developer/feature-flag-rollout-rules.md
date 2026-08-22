# Feature Flag and Rollout Rules
## Purpose
Decouple mobile binary deployment from risky feature activation and enable controlled recovery.
## Scope
Remote configuration, feature flags, experiments, kill switches, and staged activation.
## MUST
- High-risk remotely activated features MUST have safe defaults and explicit targeting rules.
- Flag evaluation failures MUST resolve to a defined safe behavior.
- Long-lived flags MUST have owners and cleanup criteria.
## MUST NOT
- Client-side flags MUST NOT be used as security authorization controls.
- Remote configuration MUST NOT enable code paths incompatible with the installed app version.
## SHOULD
- Material launches SHOULD support gradual exposure and kill-switch capability when feasible.
## Exceptions
Simple low-risk UI changes may ship without flags when rollback exposure is acceptable.
## Verification
Test default/off/on states, stale configuration, incompatible versions, targeting, kill switch, and flag cleanup reports.