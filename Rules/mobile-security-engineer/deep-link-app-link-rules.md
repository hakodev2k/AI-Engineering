# Deep Link and App Link Rules

## Purpose
Prevent untrusted links and inter-application routing from bypassing validation or authorization.

## Scope
Custom URL schemes, universal/app links, navigation intents, callbacks, and external launch parameters.

## MUST
- Treat every externally supplied link parameter as untrusted input.
- Allowlist supported routes, schemes, hosts, actions, and parameter formats.
- Revalidate authentication and authorization after routing to protected functionality.
- Verify claimed web domains using platform-supported association mechanisms when applicable.

## MUST NOT
- Execute privileged actions solely because a deep link names them.
- Pass unvalidated link data into web views, file handlers, commands, SQL, or sensitive API calls.
- Put reusable secrets in deep-link URLs.

## SHOULD
- Prefer verified HTTPS application links over ambiguous custom schemes for security-sensitive callbacks.
- Make destructive or financial actions require explicit user confirmation where appropriate.

## Exceptions
Unverified routing exceptions require collision analysis, abuse cases, compensating controls, and security approval.

## Verification
Fuzz routes and parameters; test unauthenticated, cross-account, malformed, duplicate-handler, replay, and hostile-origin scenarios.