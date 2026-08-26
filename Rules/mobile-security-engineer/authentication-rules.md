# Authentication Rules

## Purpose
Protect account authentication against credential theft, token misuse, replay, and unsafe device assumptions.

## Scope
Login, MFA, passkeys, biometrics, session bootstrap, account recovery, and reauthentication.

## MUST
- Use platform-supported and standards-based authentication flows appropriate to the identity provider.
- Require fresh or step-up authentication before sufficiently sensitive account actions based on risk.
- Bind biometric use to protected key or credential access rather than treating a biometric success callback as remote identity proof.
- Handle authentication cancellation, expiry, replay, and account switching explicitly.

## MUST NOT
- Embed reusable user credentials in application storage.
- Implement proprietary password cryptography or OAuth-like protocols when established secure protocols apply.
- Treat device unlock alone as proof that the intended remote account holder is present.

## SHOULD
- Prefer phishing-resistant authentication where supported.
- Minimize password exposure to the application process.

## Exceptions
Alternative authentication designs require threat analysis, interoperability rationale, security review, and test evidence.

## Verification
Exercise login, logout, recovery, MFA, reauthentication, replay, cancellation, and account-switch scenarios; inspect protocol configuration and token handling.