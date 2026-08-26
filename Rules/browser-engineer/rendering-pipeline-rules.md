# Rendering Pipeline Rules
## Purpose
Protect correctness, responsiveness, and compatibility across style, layout, paint, compositing, and presentation.
## Scope
Browser rendering-engine changes and integrations.
## MUST
- Rendering changes MUST preserve specified observable behavior across supported document modes.
- Pipeline invalidation MUST be bounded to the smallest correctness-preserving scope.
- New rendering behavior MUST define lifecycle, ownership, and invalidation triggers.
- Performance-sensitive changes MUST include representative before/after evidence.
## MUST NOT
- MUST NOT trade correctness for fewer layout or paint operations without an explicit specification basis.
- MUST NOT introduce hidden synchronous pipeline flushes on common paths without review.
## SHOULD
- SHOULD isolate expensive work and reuse computed state when invalidation semantics remain sound.
## Exceptions
Exceptions require documented compatibility impact, measurements, rollback strategy, and reviewer approval.
## Verification
Use rendering tests, pixel/reference tests where appropriate, invalidation diagnostics, profiles, benchmarks, and cross-platform CI.