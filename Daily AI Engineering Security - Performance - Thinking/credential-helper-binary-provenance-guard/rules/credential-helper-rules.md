# Credential Helper Rules

1. Security-sensitive credential helpers **MUST** be bound to a reviewed absolute executable path.
2. A relative or bare helper name **MUST NOT** be accepted as sufficient provenance.
3. The configured path **MUST** exist, be executable, and resolve to the reviewed real path before credential use.
4. When `check_path_shadowing` is enabled, PATH resolution of the helper basename **MUST** equal the reviewed executable path; otherwise the operation is blocked.
5. A configured SHA-256 **MUST** match exactly; hash mismatch blocks completion.
6. Helper attestation **MUST NOT** execute the helper or read credential contents.
7. Policy **MUST NOT** be sourced from an untrusted repository that can modify the helper decision.
8. Remediation **MUST NOT** disable sandboxing, keychain ACLs, approvals, or authentication controls merely to make the helper work.
9. Runtime/toolchain updates **SHOULD** trigger re-attestation.
10. Provenance failures **MUST** be distinguished from credential-value/authentication failures in logs.
11. Retries **MUST** be bounded to two remediation attempts before escalation.