# Zero Trust Architecture Rules

## Purpose
Define mandatory architecture behavior for systems adopting Zero Trust principles without assuming implicit trust from network location, device ownership, or prior authentication.

## Scope
Applies to users, workloads, services, devices, networks, administrative paths, and data-access flows.

## MUST
- Every protected resource MUST have an explicit trust decision point and enforcement point.
- Access decisions MUST evaluate identity, resource, requested action, and relevant risk context.
- Trust decisions MUST be continuously re-evaluated when material context changes.
- Architecture documents MUST identify trust boundaries, enforcement gaps, and fallback behavior.

## MUST NOT
- MUST NOT treat internal network location as sufficient proof of trust.
- MUST NOT bypass policy enforcement for convenience or legacy compatibility without approved exception.
- MUST NOT collapse authentication, authorization, and transport security into one undifferentiated control.

## SHOULD
- Policies SHOULD be centrally governable while enforcement remains close to protected resources.
- Trust assumptions SHOULD be minimized and documented explicitly.

## Exceptions
Exceptions require documented business need, threat analysis, compensating controls, expiry date, owner, and human approval.

## Verification
Verify with architecture review, data-flow diagrams, policy-path testing, configuration inspection, and adversarial testing that resources cannot be reached through undocumented implicit-trust paths.