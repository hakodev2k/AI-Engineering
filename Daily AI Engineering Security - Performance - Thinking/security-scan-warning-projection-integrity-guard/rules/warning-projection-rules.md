# Warning Projection Rules

## Scope
Applies to security-scan execution warnings that can affect the trustworthiness, freshness, completeness, or safe interpretation of a scan result.

## Rules
- A scanner **MUST** assign every material run warning a stable normalized identity before exporting results.
- A required machine-readable projection **MUST** preserve every canonical warning or explicitly declare that the projection does not support warnings and block automated trust in that projection.
- A successful exit status **MUST NOT** be interpreted as warning-free execution.
- Coverage completeness **MUST NOT** be used as a substitute for execution-integrity status.
- Target drift, cleanup failure, unverifiable limits, and comparable execution warnings **MUST** remain distinguishable from ordinary vulnerability findings.
- SARIF exporters **SHOULD** use invocation/tool-execution notifications for execution warnings when compatible with the target SARIF consumer.
- Bulk ledgers **MUST** persist non-empty warning sets per attempt and **MUST** expose aggregate warning counts.
- Automated release or scan-completion gates **MUST** fail when a canonical required warning is missing from any required projection.
- Projection validators **MUST** validate both syntax/schema and warning-set preservation.
- A repair **MUST NOT** suppress, downgrade, or rewrite a warning solely to make the integrity check pass.
- Warning text may be normalized for unstable timestamps/paths, but normalization **MUST NOT** erase warning type, target identity, severity/level, or material message content.
- Security-relevant raw artifacts **MUST NOT** include secrets merely to improve correlation; use hashes or safe identifiers.

## Observable enforcement
The deterministic verifier in `../scripts/verify_warning_projection.py` returns non-zero when required warning identities are missing or when malformed inputs prevent verification.