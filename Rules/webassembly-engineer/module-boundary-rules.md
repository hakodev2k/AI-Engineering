# WebAssembly Module Boundary Rules

## Purpose
Define stable, reviewable boundaries between WebAssembly modules, hosts, and peer components.

## Scope
Applies to module decomposition, imports, exports, host calls, and ownership of cross-boundary behavior.

## MUST
- Modules MUST expose the smallest contract required by consumers.
- Imports and exports MUST have documented ownership, lifecycle, failure semantics, and compatibility expectations.
- Host-dependent capabilities MUST be explicit dependencies rather than hidden environmental assumptions.
- Cross-boundary data representations MUST be specified independently of implementation details.
- Boundary changes MUST be reviewed for compatibility, security, latency, and portability impact.

## MUST NOT
- Modules MUST NOT depend on undocumented host globals or ambient capabilities.
- Internal implementation details MUST NOT become public exports merely for convenience.
- A boundary MUST NOT permit callers to bypass authorization, validation, or resource controls enforced elsewhere.

## SHOULD
- Cohesive behavior SHOULD remain inside one module when splitting it would create chatty host calls.
- Boundaries SHOULD favor contracts that can evolve additively.
- Pure computation SHOULD be separated from privileged host integration where practical.

## Exceptions
Exceptions require the constraint being addressed, alternatives considered, compatibility and security risks, and evidence that the chosen boundary is preferable. High-risk capability exposure requires human approval.

## Verification
Review module import/export metadata, interface definitions, architecture tests, compatibility tests, and host integration tests. Confirm every imported capability is expected and every public export has an identified consumer.