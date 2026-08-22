# API Reference Rules
## Purpose
Ensure API reference is contract-accurate and usable for implementation.
## Scope
HTTP APIs, SDKs, commands, events, schemas, and public interfaces.
## MUST
- Document supported operations, parameters, types, constraints, authentication, errors, examples, version behavior, and relevant limits from authoritative contracts.
- Distinguish required, optional, nullable, conditional, deprecated, and read-only fields.
- Keep generated and hand-authored reference boundaries explicit.
- Verify examples against the documented contract.
## MUST NOT
- Document undocumented implementation behavior as a stable public guarantee.
- Change contract semantics through editorial interpretation.
## SHOULD
- Generate repetitive reference from schemas or source metadata when the generation path is trustworthy and reviewed.
## Exceptions
Preview interfaces may document instability when lifecycle status and compatibility expectations are explicit.
## Verification
Compare documentation with schemas/source, run example requests or tests, and check reference generation diffs in CI.