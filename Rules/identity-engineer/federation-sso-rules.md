# Federation and SSO
## Purpose
Secure cross-domain authentication and single sign-on.
## Scope
OIDC, OAuth-based login, SAML, federation metadata, and trust relationships.
## MUST
- Issuer, audience, redirect targets, signatures, nonce/state, and token validity MUST be validated as required by the protocol.
- Federation trust MUST have an explicit owner and rotation/revocation procedure.
- Attribute mappings MUST be reviewed for authorization impact.
## MUST NOT
- Unsigned or unvalidated assertions MUST NOT establish identity.
- Wildcard redirect destinations MUST NOT be used where exact registration is feasible.
## SHOULD
- Prefer current, interoperable protocol profiles.
## Exceptions
Require documented interoperability constraint, threat analysis, compensating control, and approval.
## Verification
Inspect metadata/configuration, protocol traces, negative tests, and key-rotation exercises.