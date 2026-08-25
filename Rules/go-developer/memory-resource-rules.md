# Memory and Resource Rules

## Purpose
Control memory pressure and guarantee resource release.

## Scope
Allocations, buffers, files, sockets, response bodies, timers, tickers, and pools.

## MUST
- Acquired resources MUST have a deterministic release path.
- HTTP response bodies and files MUST be closed on all relevant paths.
- Memory optimizations MUST be justified by profiles or benchmarks.
- Pools MUST have measured benefit and correct ownership/reset semantics.

## MUST NOT
- MUST NOT retain large backing arrays unintentionally through small slices.
- MUST NOT leak timers, tickers, connections, or goroutines.
- MUST NOT add object pooling based on allocation intuition alone.

## SHOULD
- Stream large payloads when full materialization is unnecessary.
- Reuse buffers only when ownership is clear and data cannot escape unsafely.

## Exceptions
Intentional retention requires bounded size, lifecycle documentation, and operational monitoring.

## Verification
Use heap/allocation profiles, benchmarks, leak tests, file-descriptor monitoring, and code review of cleanup paths.