# Content Streaming Rules

## Purpose
Load and unload game content without stalls, leaks, missing dependencies, or invalid references.

## Scope
Scenes, levels, chunks, textures, meshes, audio, asynchronous loading, and residency.

## MUST
- Streaming boundaries MUST define ownership and lifetime of loaded resources.
- Asynchronous loads MUST handle cancellation, failure, and late completion safely.
- Required dependencies MUST be declared or discoverable before activation.
- Memory residency MUST stay within target-platform budgets under worst representative traversal.

## MUST NOT
- MUST NOT block the main thread on avoidable large asset I/O during latency-sensitive gameplay.
- MUST NOT unload resources still owned by active gameplay objects.

## SHOULD
- Prefetching SHOULD be driven by measured traversal and latency evidence.
- Loading transitions SHOULD expose progress only when progress semantics are meaningful.

## Exceptions
Small bounded content sets may use eager loading when measured memory and startup budgets permit it.

## Verification
Profile I/O, memory residency, load hitches, cancellation paths, dependency failures, and repeated load/unload cycles.