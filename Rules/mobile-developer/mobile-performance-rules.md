# Mobile Performance Rules
## Purpose
Protect startup time, interaction latency, frame smoothness, memory, and perceived responsiveness.
## Scope
Startup, rendering, scrolling, I/O, serialization, image loading, and critical interactions.
## MUST
- Performance claims MUST include before/after measurements on representative devices and builds.
- Expensive startup work MUST be deferred, parallelized safely, or removed unless required before first usable interaction.
- Main-thread stalls affecting user experience MUST be investigated with profiling evidence.
## MUST NOT
- Debug-build performance MUST NOT be used as the sole production performance conclusion.
- Optimization MUST NOT trade correctness or security without explicit approval.
## SHOULD
- Define budgets for startup, frame time, memory, and critical network interactions where product impact warrants them.
## Exceptions
Temporary budget breaches require measured impact, owner, remediation plan, and acceptance.
## Verification
Use release-mode profilers, traces, frame metrics, startup benchmarks, and representative low/mid-tier devices.