# Install Security Rules

1. New MCP/agent packages **MUST** be resolved to an exact version and immutable hash before approval.
2. Untrusted package code **MUST NOT** execute before quarantine completes.
3. Known malicious package/version matches **MUST** block installation.
4. Unknown publisher/source identity **MUST** remain quarantined until reviewed.
5. Lifecycle scripts, native build files, downloaded executables, or obfuscated launchers **MUST** be treated as elevated risk.
6. Inspection environments **MUST NOT** contain production/cloud/GitHub/npm credentials.
7. A lockfile/hash **MUST NOT** be treated as proof that a package is benign.
8. Sandbox installation **SHOULD** disable lifecycle scripts initially and restrict network egress.
9. Security exceptions **MUST** record owner, rationale, scope, hash/version and expiry.
10. Agents **MUST NOT** self-approve a blocking package finding.
11. A reviewer independent from the requesting/implementing agent **MUST** verify high-risk overrides.
12. Missing advisory data or malformed metadata **MUST** fail closed to quarantine.