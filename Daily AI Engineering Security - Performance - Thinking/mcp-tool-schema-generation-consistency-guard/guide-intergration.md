# Integration Guide

## Where to integrate
Place the guard between MCP catalog discovery and every `tools/call`. The application should expose one `ToolCatalogStore` abstraction whose live value is an immutable generation object. All model-facing tool descriptions, routing checks, dispatch metadata, and output validation should derive from that same object.

## Generation object
A production generation should minimally contain:
- `generationId` (monotonic sequence or UUID),
- `catalogHash`,
- immutable tool definitions,
- compiled output validators keyed by tool name,
- task-support/routing metadata,
- schema hashes,
- publication timestamp,
- in-flight lease/reference count.

Do not put request-specific secrets or tool payloads in this object.

## Refresh integration
1. Receive startup/TTL/`tools/list_changed` trigger.
2. Fetch `tools/list` without mutating current generation.
3. Validate/compile the candidate completely. `scripts/schema_generation_guard.py validate-catalog` is a lightweight precheck; production should use the same standards-compliant JSON Schema engine as the client.
4. Construct the full immutable candidate including validators and task metadata.
5. If any step fails, discard candidate and preserve current generation.
6. Atomically swap the generation reference only after candidate completion.
7. Mark previous generation retired; garbage-collect only after its lease count reaches zero.

## Call integration
Pseudo-API shape:

```text
lease = catalogStore.acquireCurrent()
meta = lease.generation.requireTool(name)
validator = meta.outputValidator
schemaHash = meta.schemaHash
trace.dispatch(requestId, lease.generation.id, name, schemaHash)
try:
    result = await transport.callTool(name, args)
    validator?.validate(result.structuredContent)
    trace.validate(requestId, lease.generation.id, schemaHash, validator != null)
    return result
finally:
    lease.release()
```

The key property is that `validator` is captured before `await transport.callTool(...)`. A refresh after dispatch may change `catalogStore.current`, but it cannot alter `lease.generation`.

## Failure-atomic publication patterns
- **JavaScript/TypeScript:** build new `Map`/`Set` instances, then replace a single private generation reference.
- **.NET:** build immutable dictionaries (`ImmutableDictionary`) inside a candidate object; publish with `Interlocked.Exchange` or a lock around only the pointer swap; use a lease/ref-count wrapper for retired generations.
- **Java:** immutable maps plus `AtomicReference<Generation>`.
- **Rust:** immutable generation behind `Arc`, current generation behind `ArcSwap`/appropriate lock; in-flight calls keep cloned `Arc`.

## Telemetry
Emit structured events without raw tool data:

```json
{"event":"dispatch","request_id":"...","generation_id":"g41","tool":"search","schema_hash":"...","schema_expected":true}
{"event":"refresh_publish","request_id":"refresh-42","generation_id":"g42","catalog_hash":"..."}
{"event":"validate","request_id":"...","generation_id":"g41","schema_hash":"...","validator_present":true,"outcome":"pass"}
```

Run `python scripts/schema_generation_guard.py analyze --events trace.jsonl` in CI or incident analysis.

## Migration sequence
1. Instrument current client with generation/schema hashes but change no behavior.
2. Capture baseline mismatch/missing-validator counts.
3. Implement failure-atomic candidate compilation/publication.
4. Implement request leases and pre-await validator capture.
5. Add fail-closed behavior for schema-expected/missing-validator state.
6. Run race and fault-injection tests.
7. Canary with mismatch telemetry; expected count is zero.
8. Roll out broadly only after independent verification.

## Compatibility
The approach does not require MCP protocol changes. It works with refresh driven by notifications, TTL, or explicit list calls. Servers need not know generation IDs; they are client-side provenance identifiers.

## Safety
A generation guard preserves the integrity of validation state but does not authenticate an MCP server, sanitize malicious tool content, or grant tool authorization. Keep existing transport security, authorization, human approval, sandboxing, output sanitization, and least-privilege controls.
