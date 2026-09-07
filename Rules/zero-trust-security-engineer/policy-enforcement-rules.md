# Policy Enforcement Rules

## Purpose
Ensure access policy is enforced consistently at every protected boundary and cannot be silently bypassed.

## Scope
Applies to gateways, proxies, applications, APIs, databases, infrastructure control planes, and endpoint enforcement points.

## MUST
- Every protected path MUST traverse an identified policy enforcement point.
- Enforcement points MUST fail according to explicitly designed availability and security behavior.
- Policy inputs MUST be authenticated, integrity-protected, and fresh enough for their risk purpose.
- Deny decisions MUST be enforceable before the protected operation occurs.

## MUST NOT
- MUST NOT rely on client-side controls as the sole enforcement mechanism for privileged actions.
- MUST NOT allow undocumented bypass routes around policy controls.
- MUST NOT silently convert policy-evaluation errors into unconditional allow decisions.

## SHOULD
- Enforcement logic SHOULD be standardized to reduce divergent authorization behavior.
- Decision reasons SHOULD be observable without exposing sensitive policy internals to untrusted callers.

## Exceptions
Bypasses require explicit approval, bounded scope, compensating controls, monitoring, owner, and expiry.

## Verification
Use route enumeration, architecture tests, policy simulation, negative authorization tests, failure-mode tests, and configuration review to prove every protected operation is mediated by the intended control.