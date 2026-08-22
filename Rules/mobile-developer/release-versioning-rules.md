# Release Versioning Rules
## Purpose
Keep binaries, backend compatibility, diagnostics, and upgrade paths unambiguous across installed versions.
## Scope
Semantic/product versions, build numbers, API compatibility, minimum versions, and forced upgrades.
## MUST
- Every distributed artifact MUST have a unique build identity traceable in diagnostics.
- Minimum-supported app versions MUST be enforced only with a documented compatibility and user-impact strategy.
- Backend feature changes MUST identify which installed client versions can safely consume them.
## MUST NOT
- Version strings MUST NOT be reused for materially different production artifacts.
- Forced upgrade MUST NOT be the default recovery mechanism when backward compatibility is feasible.
## SHOULD
- Version policy SHOULD distinguish marketing version, build identity, and protocol capability.
## Exceptions
Internal non-distributed builds may use simplified versioning if artifact traceability remains intact.
## Verification
Inspect build metadata, crash telemetry, API compatibility tests, upgrade prompts, and release history.