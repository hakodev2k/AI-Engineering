# OAuth and Token Security
## Purpose
Constrain delegated authorization and bearer-token risk.
## Scope
OAuth grants, access tokens, refresh tokens, scopes, and token validation.
## MUST
- Clients MUST use grant types appropriate to their trust model.
- Tokens MUST be audience-, issuer-, lifetime-, and signature-validated where applicable.
- Scopes and claims MUST represent the minimum authority needed.
- Refresh-token storage and rotation MUST match compromise risk.
## MUST NOT
- Access tokens MUST NOT be accepted by unintended audiences.
- Long-lived bearer credentials MUST NOT be embedded in source or public clients.
## SHOULD
- Prefer short-lived access tokens and sender-constrained mechanisms when justified.
## Exceptions
Document interoperability need, exposure, controls, expiry, and approval.
## Verification
Protocol tests, token inspection, secret scanning, configuration review, and misuse tests.