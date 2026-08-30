# Memory Isolation Rules

1. Every memory/checkpoint read MUST derive tenant identity from an authenticated server-side principal, not from model output or an untrusted request field.
2. Storage query scoping MUST NOT be the only authorization control; every returned object MUST be checked against canonical tenant identity before use.
3. User- or agent-controlled MongoDB-style filters MUST reject keys beginning with `$` unless an explicit allowlist and authorization policy permits a specific operator.
4. Namespace matching MUST be segment-aware; string-prefix coincidence MUST NOT authorize access.
5. Namespace labels containing backend pattern metacharacters MUST be escaped or rejected before query construction.
6. Production package versions MUST be checked against current security advisories before release.
7. All configured persistence backends MUST pass the same adversarial tenant-isolation corpus.
8. Security tests MUST include sibling-prefix tenants, wildcard/metacharacter labels, malformed filter objects, nested operator keys, and post-retrieval ownership mismatch.
9. A cross-tenant read MUST block deployment; teams MUST NOT lower test coverage or loosen authorization to regain compatibility.
10. Security-sensitive persistence changes SHOULD be independently reviewed by someone other than the implementer.
11. Logs MUST record violation class and opaque tenant identifiers; logs MUST NOT record memory content, credentials, or secrets unless explicitly approved and protected.
12. Dangerous or irreversible remediation actions on production data MUST require explicit human approval.
