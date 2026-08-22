# MCP Tool Schema Generation Consistency Guard

## Topic
Prevent dynamic MCP tool-catalog refreshes from changing or corrupting the validation contract of in-flight tool calls.

## Category
Security — validation integrity and trust-boundary consistency.

## Problem
MCP clients can refresh tool metadata while `tools/call` requests are in flight. If a client resolves the output validator after awaiting the response, the call can be validated against a newer schema generation than the one active at dispatch. A separate failure mode occurs when a refresh clears the live cache before all replacement schemas compile: a failed refresh can erase previously valid validators, allowing later results to bypass expected validation.

## Evidence
Current public evidence is documented in `evidence/research.md`. The strongest signals are modelcontextprotocol/typescript-sdk issues #2612 and #2614, both opened 2026-08-04 and still open/updated 2026-08-18, plus the MCP 2026-07-28 specification's dynamic tool-list and output-schema validation requirements.

## Existing approach
Typical clients maintain mutable maps for validators/task metadata, refresh those maps after `tools/list`, and validate tool output after the network request returns. Refresh may be triggered by startup, polling/freshness, or `notifications/tools/list_changed`.

## Existing limitations
- Tool name is not a schema-version identity.
- Mutable clear/repopulate publication is not failure atomic.
- Validator lookup after a network `await` creates a TOCTOU window.
- Failed refresh can destroy the last known-good validation state.
- Locking every call for an entire refresh preserves consistency but unnecessarily serializes execution.

## Proposed improvement
Use immutable, versioned metadata generations:
1. Build and compile a complete candidate catalog away from live state.
2. Publish one immutable generation atomically only after the candidate succeeds.
3. Capture/pin generation ID, validator, schema hash, and task metadata before `tools/call` dispatch.
4. Validate the response with that pinned validator even if a newer generation becomes current meanwhile.
5. Retain old generations until all in-flight leases are released.
6. Fail closed when a schema was expected at dispatch but trustworthy pinned validation metadata is unavailable.
7. Emit generation provenance for audit and regression detection.

## Architecture

```text
 tools/list / list_changed / TTL
             |
             v
     Candidate Builder
   fetch -> compile all -> hash
             |
        success only
             v
      Atomic Publisher --------> Current Generation G(n+1)
             |                         |
             |                         +--> new calls pin G(n+1)
             |
             +---- retire G(n) <------+ in-flight old calls keep lease
                                           |
 tools/call dispatch --> pin G(n) ----------+
        |                                    |
        +---- network await -----------------+
        |                                    |
 response ------------------> validate with pinned G(n) validator
```

The model and tool server do not need awareness of client-side generation IDs.

## Package structure

```text
mcp-tool-schema-generation-consistency-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── generation_snapshot.py
│   └── schema_generation_guard.py
├── tests/
│   └── test_schema_generation_guard.py
└── verification/
    └── report.md
```

## Installation
The reusable scripts require Python 3.10+ and only the standard library.

```bash
python scripts/schema_generation_guard.py --help
python scripts/generation_snapshot.py --help
```

For production integration, implement immutable generation storage in the client language/runtime. `guide-intergration.md` includes TypeScript/.NET/Java/Rust patterns.

## Configuration
Start from `config/policy.json`. Security-significant defaults are:
- compile entire replacement before publication;
- preserve last good generation after refresh failure;
- pin validator/task metadata before dispatch;
- fail closed when a dispatch-generation schema exists but validator provenance is missing;
- retain generations until in-flight count reaches zero;
- retry refresh at most twice.

## Usage
### Validate a candidate catalog

```bash
python scripts/schema_generation_guard.py validate-catalog --catalog candidate.json
```

### Build an immutable generation descriptor

```bash
python scripts/generation_snapshot.py \
  --catalog candidate.json \
  --generation g42 \
  --out state/g42.json
```

### Audit runtime trace provenance

```bash
python scripts/schema_generation_guard.py analyze --events trace.jsonl
```

The analyzer returns exit code `3` for consistency violations such as `GENERATION_MISMATCH`, `SCHEMA_HASH_MISMATCH`, or `MISSING_PINNED_VALIDATOR`.

## Workflow
Use `workflows/workflows.md` for three bounded flows:
- Safe Catalog Refresh
- Generation-Pinned Tool Call
- Regression Investigation Loop

The core execution invariant is: **the contract selected at dispatch remains the contract used for response validation**.

## Metrics
Required operational metrics:
- `cross_generation_validation_total` — target `0`.
- `schema_expected_missing_validator_total` — target `0`.
- `partial_generation_publication_total` — target `0`.
- failed-refresh previous-generation preservation ratio — target `1.0`.
- output-schema validation coverage — target `1.0` for eligible non-error responses.
- refresh compile latency and publish latency.
- current/retired generation count and live leases.

Do not claim improvement from architecture alone; measure these before and after integration.

## Verification
`tests/test_schema_generation_guard.py` includes deterministic regression tests for:
- valid/invalid candidate schemas;
- dispatch/validation generation mismatch;
- missing pinned validator;
- refresh occurring while a request remains pinned to the old generation;
- atomic snapshot file publication.

`verification/report.md` defines the full runtime race and fault-injection gate. Production completion requires target-runtime tests plus independent verification.

## Security
This package protects validation-state integrity. It does **not** replace:
- MCP server authentication or authorization;
- transport security;
- tool permission/approval boundaries;
- sandboxing;
- prompt-injection defenses;
- output sanitization/DLP;
- idempotency/replay controls for side-effecting tools.

Tool annotations remain untrusted when the server is untrusted. Never replay a side-effecting operation simply because client-side validation failed; first determine whether the external action occurred.

## Failure handling
- Invalid candidate schema: reject candidate immediately; leave current generation untouched.
- Transient refresh failure: retry at most twice, then keep last-good generation and mark stale.
- Missing validator for a dispatch-generation schema: reject result/fail closed.
- Generation mismatch in telemetry: treat as a blocking integrity defect and stop release/canary expansion.
- Retention pressure: do not evict a generation with active leases; throttle/alert instead.
- No valid generation at startup: block schema-dependent tool execution and surface the failure rather than disabling validation.

## Definition of Done
- Real evidence and existing limitations are documented.
- Complete candidate compilation precedes publication.
- Publication is atomic and failed refresh preserves prior complete state.
- Calls pin generation metadata before network await.
- Responses are validated using pinned provenance only.
- Deterministic and runtime concurrency/fault-injection tests pass.
- Metrics demonstrate zero mismatch/bypass/partial-publication events during canary.
- Security controls remain unchanged or stronger.
- Independent verifier signs off on security-sensitive integration.

## Customization
- Change retention count based on maximum concurrent call duration and refresh frequency, but never evict live generations.
- Replace generation IDs with monotonic integers, UUIDs, or `(server_session, counter)` identifiers.
- Use SHA-256 or another stable digest for schema/catalog provenance.
- Adapt telemetry to OpenTelemetry spans/events while avoiding sensitive tool payloads.
- For multi-server clients, scope generations by authenticated server/session identity; never merge same-named tools across servers without explicit disambiguation.

See `guide-intergration.md`, `skills/core-skills.md`, `rules/engineering-rules.md`, and `verification/report.md` for implementation details.
