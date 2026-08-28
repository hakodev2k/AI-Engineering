# Build Cache Rules

## Purpose
Ensure local and remote build caches improve performance without compromising correctness, security, or debuggability.

## Scope
Applies to cache keys, artifact storage, remote cache services, eviction, poisoning resistance, and cache observability.

## MUST
- Cache keys MUST include every declared input capable of changing the cached output, including relevant toolchain and configuration versions.
- Cached artifacts MUST be integrity-checked before consumption when crossing trust boundaries.
- Shared caches MUST enforce access controls appropriate to the sensitivity and provenance of stored artifacts.
- Cache corruption or poisoning signals MUST support rapid bypass and invalidation.
- Build failures suspected to involve caching MUST be reproducible with the cache disabled.

## MUST NOT
- MUST NOT reuse cached outputs across incompatible platforms, architectures, toolchains, or build modes unless equivalence is proven.
- MUST NOT cache secrets or credentials in build artifacts.
- MUST NOT make cache availability a correctness dependency for builds.

## SHOULD
- Cache effectiveness SHOULD be measured with hit rate, transfer cost, saved compute time, and eviction behavior.
- Cache namespaces SHOULD isolate incompatible or untrusted producers.

## Exceptions
Exceptions require documented equivalence assumptions, risk analysis, bounded scope, and verification against uncached builds.

## Verification
Inspect cache key composition, run cache-on/cache-off comparisons, test corrupted entries, review authorization, and monitor hit/miss metrics.