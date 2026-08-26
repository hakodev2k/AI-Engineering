# Logging and Telemetry Rules

## Purpose
Preserve diagnostic value without leaking credentials, personal data, or security-sensitive application state.

## Scope
Application logs, analytics, crash reports, traces, breadcrumbs, diagnostics, and support exports.

## MUST
- Define prohibited sensitive fields and redact them before telemetry leaves the application process.
- Use structured events that avoid embedding arbitrary request, response, credential, or user-entered content.
- Review third-party telemetry destinations and retention for sensitive applications.
- Make security-relevant audit events attributable without exposing secrets.

## MUST NOT
- Log passwords, authentication tokens, private keys, session cookies, recovery codes, or full payment secrets.
- Enable verbose production logging that exposes sensitive payloads without explicit bounded approval.
- Assume crash reporters automatically sanitize application data.

## SHOULD
- Use stable non-sensitive correlation identifiers for investigations.
- Sample high-volume diagnostics without suppressing critical security signals.

## Exceptions
Temporary diagnostic exceptions require scope, duration, access controls, deletion plan, and approval.

## Verification
Inspect source instrumentation and captured production-equivalent telemetry; exercise error paths and scan outputs for prohibited data classes.