# Compatibility Contract Testing Rules
## Purpose
Prove that independently deployed mobile clients and services remain compatible over real upgrade windows.
## Scope
API schemas, feature flags, remote config, authentication, push payloads, and supported app versions.
## MUST
- Contract tests MUST include the oldest materially supported client behavior for server changes that affect it.
- Payload evolution MUST test unknown fields, missing optional fields, enum expansion, and version-gated behavior where relevant.
- Remote configuration MUST be tested against clients that do not understand newly introduced values.
## MUST NOT
- Latest-client-only tests MUST NOT justify a backend breaking change while older versions remain supported.
- Test fixtures MUST NOT assume ideal ordering or freshness when protocols allow delay.
## SHOULD
- Keep representative serialized fixtures from production-compatible versions for regression testing.
## Exceptions
Hard minimum-version enforcement may reduce the matrix only after enforcement is safely deployed and verified.
## Verification
Run cross-version contract suites, serialized fixture tests, minimum-version scenarios, and staged server compatibility checks.