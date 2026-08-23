# Error Response Rules

## Purpose
Provide useful API failures without leaking exploitable implementation details.

## Scope
Validation, authentication, authorization, business, dependency, and unexpected errors.

## MUST
- Use stable error contracts that distinguish client-correctable failures without exposing sensitive internals.
- Correlate unexpected failures to server-side diagnostics using non-sensitive identifiers.
- Ensure authentication and authorization errors do not disclose information that enables account or resource enumeration.
- Preserve diagnostic evidence internally for unexpected failures.

## MUST NOT
- Return stack traces, connection strings, secrets, raw database errors, internal paths, or framework diagnostics to untrusted clients.
- Silently convert security-control failures into success responses.

## SHOULD
- Keep externally observable error differences minimal when differences create enumeration risk.

## Exceptions
Detailed diagnostics may be exposed only in controlled non-production environments with equivalent data protections.

## Verification
Test representative failure paths and inspect responses, logs, traces, and production error configuration.