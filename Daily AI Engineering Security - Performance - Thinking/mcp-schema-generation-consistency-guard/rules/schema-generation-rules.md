# MCP Schema Generation Rules

## MUST
- Treat a discovered tool catalog and its derived validators/task metadata as one immutable generation.
- Build candidate generations separately from the active generation.
- Compile every required output schema before publication.
- Publish a candidate only after complete validation succeeds.
- Keep the last known-good generation intact when refresh fails.
- Pin the schema generation and validator before dispatching a tool call.
- Validate the response with the pinned validator even if a newer generation becomes active.
- Record tool name, generation id/hash, and validation outcome in audit telemetry.

## MUST NOT
- Clear active validator metadata before the replacement generation is complete.
- Read a mutable current validator after awaiting an in-flight call.
- Treat a refresh failure as permission to skip output validation.
- Retry invalid schema compilation indefinitely.
- silently coerce a result to satisfy a newer schema.
- expose secrets in catalog-generation logs.

## SHOULD
- Use canonical schema hashing to make generations reproducible.
- Bound retained old generations by active in-flight references plus a small safe history.
- Alert on any path where an output-schema tool completes without validation.
- Test concurrent refresh and call completion deterministically.
