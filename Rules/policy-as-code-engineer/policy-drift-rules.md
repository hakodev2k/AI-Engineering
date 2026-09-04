# Policy Drift Rules

## Purpose
Detect and correct divergence between intended policy, deployed policy, enforcement configuration, and observed runtime behavior.

## Scope
Applies to policy bundles, evaluator configuration, enforcement modes, exceptions, runtime versions, environment-specific overrides, and unmanaged control implementations.

## MUST
- Protected environments MUST have a way to determine the policy version and enforcement configuration actually in effect.
- Material divergence between approved policy state and deployed policy state MUST be detectable within a defined operational interval.
- Drift detection MUST cover enforcement mode, policy version, and active exception state when those dimensions affect control strength.
- Unexpected drift affecting security or production safeguards MUST be triaged according to its blast radius and exposure risk.
- Remediation MUST restore a known approved state or follow an explicitly reviewed change process.

## MUST NOT
- Configuration drift MUST NOT be dismissed solely because policy source in version control is correct.
- Unmanaged local overrides MUST NOT silently supersede centrally governed controls.
- Drift remediation MUST NOT overwrite legitimate emergency state before its incident context and authority are understood.

## SHOULD
- Critical policy systems SHOULD continuously compare intended and observed state.
- Repeated drift SHOULD trigger root-cause analysis of deployment, ownership, or configuration-management weaknesses.

## Exceptions
Intentional temporary divergence requires documented owner, scope, reason, approval, expected end state, and expiry or follow-up trigger.

## Verification
Compare approved artifacts and configuration with runtime inventory, query evaluator version endpoints where available, inspect active exceptions, test drift alerts, and review remediation history. Confirm intentionally introduced representative drift is detected.