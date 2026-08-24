# Authentication and Session Rules

## Purpose
Ensure authentication state and credentials are handled safely across lifecycle and failure conditions.

## Scope
Applies to login, token handling, session renewal, logout, biometric gates, and protected application state.

## MUST
- Treat backend authorization as authoritative; client-side gates MUST NOT be the sole protection for privileged operations.
- Store reusable credentials/tokens only using storage appropriate to their sensitivity and platform threat model.
- Serialize or otherwise coordinate token refresh so concurrent failures do not create refresh storms or inconsistent credentials.
- Clear session-bound sensitive state on confirmed logout/account removal according to product requirements.
- Handle expired, revoked, and invalid credentials as explicit states.

## MUST NOT
- Log tokens, passwords, recovery secrets, or authentication headers.
- Embed privileged long-lived secrets in the application package.
- Treat biometric device authentication as equivalent to server authorization unless the protocol explicitly establishes that guarantee.

## SHOULD
- Prefer short-lived access credentials and secure refresh mechanisms.
- Make authentication transitions observable and testable.

## Exceptions
Any weakened credential handling requires a threat assessment, compensating controls, and security approval.

## Verification
Use auth integration tests, storage inspection, concurrency tests around refresh, logout tests, and security review of credential lifetime and scope.