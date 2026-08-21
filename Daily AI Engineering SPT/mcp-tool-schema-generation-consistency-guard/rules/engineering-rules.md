# Engineering Rules

## MUST
- MUST represent tool metadata as an immutable catalog generation, not independently mutable per-tool cache state.
- MUST compile and validate the entire candidate generation before publication.
- MUST publish a candidate generation with a single atomic reference/state transition.
- MUST preserve the previous complete generation when refresh fetch, parsing, schema compilation, or metadata construction fails.
- MUST capture generation ID, output validator, schema hash, and task-execution metadata before dispatching `tools/call`.
- MUST validate a response using the exact validator captured for that request; a later catalog refresh MUST NOT change its validation contract.
- MUST fail closed when a tool had an `outputSchema` at dispatch but a trustworthy pinned validator is unavailable.
- MUST retain a generation until all requests pinned to it are terminal and leases/references are released.
- MUST record request ID, server/session identity, generation ID, tool name, schema hash, refresh outcome, and validation outcome without logging sensitive tool payloads by default.
- MUST bound refresh retries to at most the configured maximum and surface stale-generation status after exhaustion.
- MUST treat tool annotations and server-provided metadata according to MCP trust rules; generation consistency does not make an untrusted server trusted.
- MUST run concurrency tests for refresh during in-flight call and failure-atomic tests for invalid replacement schemas.

## MUST NOT
- MUST NOT clear the live validator/task metadata maps before a replacement catalog is fully compiled.
- MUST NOT look up the current validator after awaiting the network response for an already-dispatched call.
- MUST NOT treat tool name as sufficient schema identity.
- MUST NOT switch an in-flight request to a newer generation for convenience.
- MUST NOT retry a side-effecting tool solely because a client-side generation/validation bug occurred; first determine external effect state.
- MUST NOT silently disable output validation after schema compilation failure.
- MUST NOT allow a failed refresh to produce a partially visible generation.
- MUST NOT evict a generation while it has live leases.

## SHOULD
- SHOULD use monotonically increasing generation numbers plus stable catalog/schema hashes.
- SHOULD compile schemas outside the publication critical section so refresh does not block unrelated calls longer than necessary.
- SHOULD keep a bounded number of retired generations and garbage-collect only those with zero in-flight references.
- SHOULD expose metrics for refresh latency, compile failures, retained generations, validation failures, and generation mismatches.
- SHOULD refresh immediately on `tools/list_changed` while preserving in-flight generation semantics.
- SHOULD use the server's cache/freshness hints where applicable without weakening generation isolation.
- SHOULD independently verify security-sensitive changes with an agent/person other than the implementer.
