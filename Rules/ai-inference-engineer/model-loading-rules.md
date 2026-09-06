# Model Loading Rules

## Purpose
Make model startup, warmup, replacement, and eviction predictable and safe.

## Scope
Artifact download, integrity validation, deserialization, device placement, warmup, lazy loading, and eviction.

## MUST
- Model artifacts MUST be integrity-checked before serving traffic.
- Startup readiness MUST require successful model load and representative inference validation.
- Warmup behavior MUST reflect kernels, shapes, and execution paths used in production.
- Model replacement MUST define memory overlap requirements and fallback behavior.
- Lazy-loading paths MUST have bounded latency and failure handling.

## MUST NOT
- MUST NOT mark a replica ready before its required model state is usable.
- MUST NOT load unverified artifacts into production serving processes.
- MUST NOT evict an active model without accounting for in-flight requests and reload cost.

## SHOULD
- Separate artifact-fetch latency from deserialization, compilation, and device-placement metrics.
- Pre-warm high-priority models where cold-start latency would violate requirements.

## Exceptions
Deferred loading requires documented latency impact, fallback behavior, and approval.

## Verification
Inspect readiness probes, artifact hashes, cold-start tests, warmup traces, and replacement tests.