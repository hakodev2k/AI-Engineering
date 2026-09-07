# Media Security Rules

## Purpose
Protect streaming systems against hostile media, unauthorized control, dependency compromise, and data exposure.

## Scope
Parsers, media libraries, APIs, service identities, dependencies, secrets, and untrusted media processing.

## MUST
- Media inputs crossing a trust boundary MUST be treated as untrusted and parsed with explicit size, recursion, duration, dimension, and resource bounds.
- Services MUST use least-privilege identities and authenticated service-to-service communication where required by the threat model.
- Vulnerable codec, parser, and network dependencies MUST be inventoried and remediated according to risk.
- Security-sensitive configuration changes MUST be reviewed and supported by configuration or test evidence.

## MUST NOT
- MUST NOT run untrusted media processing with unnecessary host, network, filesystem, or credential privileges.
- MUST NOT expose credentials, signing secrets, access tokens, or private media URLs in logs or source.
- MUST NOT disable validation, sandboxing, or access controls merely to unblock a stream.

## SHOULD
- High-risk media parsers SHOULD be isolated with sandboxing and resource controls where practical.
- Dependency updates SHOULD include malformed-media regression coverage.

## Exceptions
Security exceptions require explicit owner approval, threat/risk documentation, compensating controls, and expiry.

## Verification
Use security review, fuzzing, dependency scans, secret scans, privilege/config inspection, negative authorization tests, and sandbox validation.