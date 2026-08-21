# .NET Runtime Rules

## Purpose
Define rules for safe use of the .NET runtime, memory, threading, and hosting behavior.

## Scope
Applies to managed applications, ASP.NET Core services, workers, and libraries.

## MUST
- Runtime-sensitive decisions MUST be based on the project target framework and supported runtime version.
- Blocking operations on request or worker hot paths MUST be identified and justified.
- Allocation-heavy code on critical paths MUST be measured before optimization claims are made.
- Thread-pool starvation, GC pressure, and sync-over-async risks MUST be considered during performance investigations.
- Long-lived objects and caches MUST have bounded lifetime or eviction strategy.

## MUST NOT
- MUST NOT force full GC in normal application flow without measured evidence and approval.
- MUST NOT use `Task.Run` to disguise naturally asynchronous I/O.
- MUST NOT retain large object graphs in static state without lifecycle justification.

## SHOULD
- Prefer runtime diagnostics such as counters, traces, dumps, and profilers over assumptions.
- Prefer framework defaults unless evidence shows they are unsuitable.

## Exceptions
Any low-level runtime tuning requires baseline measurements, expected benefit, rollback path, and reviewer approval.

## Verification
Use `dotnet-counters`, traces, dumps, profiler data, load tests, allocation measurements, and code review.