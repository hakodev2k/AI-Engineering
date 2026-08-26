# Serialization and Schema

## Purpose
Keep cached representations compatible, bounded, and safe to decode.

## Scope
Value formats, compression, schema evolution, codecs, and object size.

## MUST
- Cached value formats MUST have defined compatibility expectations across concurrently deployed producers and consumers.
- Incompatible schema changes MUST use versioned keys, dual compatibility, coordinated eviction, or equivalent migration.
- Deserialization MUST enforce size and type expectations for untrusted or shared inputs.
- Compression decisions MUST be measured for CPU, latency, bandwidth, and memory trade-offs.

## MUST NOT
- Deployment ordering MUST NOT assume all cache entries were written by the newest application version.
- Unsafe general-purpose object deserialization MUST NOT be used on data that an attacker or lower-trust producer can influence.
- Large object growth MUST NOT be ignored when it materially changes capacity or latency.

## SHOULD
- Prefer explicit, stable schemas over runtime-specific opaque object graphs.
- Track serialized object-size distributions.

## Exceptions
Document compatibility evidence, migration behavior, security implications, and rollback.

## Verification
Use cross-version tests, fuzz or malformed-input tests, size telemetry, benchmarks, and staged deployment validation.