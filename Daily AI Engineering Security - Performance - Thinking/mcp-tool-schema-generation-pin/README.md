# MCP Tool Schema Generation Pin

## Category
Thinking / Security

## Problem
Dynamic MCP tool metadata can change while a tool call is in flight. If a client looks up validators from a mutable global cache after awaiting the response, an old call can be validated against a newer schema. Failed schema compilation can also leave derived cache state partially replaced.

## Evidence
See `evidence/research.md` for current MCP TypeScript SDK race/cache reports, Python SDK change-notification handling evidence, and the 2026-07-28 MCP tool caching/change semantics.

## Existing approach and limitation
Refresh-on-change and global validator caches are common, but name-only mutable caches do not preserve snapshot consistency across asynchronous calls, and non-transactional rebuilds can publish partial state.

## Proposed improvement
Treat each tool-list version as an immutable generation. Pin every call to the exact dispatch-time generation and schema hash. Build refreshed validators in staging and publish the generation atomically only after complete successful compilation.

## Architecture
- `evidence/research.md` — evidence, limitations, root causes, metrics.
- `config/policy.json` — generation/rollback defaults.
- `rules/schema-generation-rules.md` — enforceable snapshot rules.
- `skills/schema-snapshot-pinning.md` — reusable procedure.
- `subagents/schema-race-verifier.md` — independent verifier.
- `workflows/refresh-and-race-verification.md` — bounded refresh workflow.
- `hooks/pre-and-post-call-generation-check.md` — dispatch/result integrity hook.
- `scripts/schema_generation_guard.py` — deterministic generation/hash checker.
- `tests/race-fixture.json` — known-good pinned-generation fixture.

## Installation
Requires Python 3.10+ and no third-party packages. Integrate generation ids and schema hashes into the host's MCP call records.

## Configuration
Use `config/policy.json`. Keep atomic publication, pre-dispatch pinning, and rollback-on-compile-failure enabled. Decide explicitly whether a failed refresh may continue serving the last known-good generation.

## Usage
Capture a call record with dispatch and validation generation/schema fields, then run:

`python scripts/schema_generation_guard.py call-record.json`

Exit 0 means the call retained its schema generation. Non-zero means invalid input or a cross-generation integrity failure.

## Workflow
Observe refresh → measure active generation → diagnose metadata delta → compile complete staging generation → validate hashes → atomic publish for future calls → complete older calls against pinned prior generation → independent race verification.

## Metrics
Cross-generation validation count, partial publication count, schema compile failures, refresh duration, stale-known-good duration, change-notification handling coverage.

## Verification
The package is **Implemented** when call pinning and atomic generation publication are integrated, **Measured** when refresh/race metrics are captured, and **Verified** when the independent verifier proves A-in-flight remains on A after B is published and malformed B cannot mutate active A.

## Safety
Never recover from a mismatch by disabling schema validation. Do not automatically replay a side-effecting call merely because its result cannot be accepted after an integrity failure; first reconcile whether the side effect already happened.

## Failure handling
Detection: generation/hash mismatch or staging compile failure. Evidence: call ledger, schema hashes, refresh event, active/staging generation ids. Retry: maximum 2 metadata refreshes with newly obtained/corrected data. Fallback: retain last known-good generation only if policy allows. Escalation: MCP client/runtime owner. Stop: any cross-generation validation or exhausted refresh retries.

## Definition of Done
Evidence documented; all package files exist; every call records generation/hash; refresh publication is atomic; malformed staging generation leaves active state unchanged; race fixture passes; independent verification succeeds; no validation/security requirement is weakened.

## Customization
Generation ids may be sequence numbers, content hashes, or composite server epochs, but they must be immutable, unambiguous, and carried through the full call lifecycle.
