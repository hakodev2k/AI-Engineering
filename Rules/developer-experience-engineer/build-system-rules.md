# Build System Rules
## Purpose
Protect build correctness, determinism, speed, and diagnosability.
## Scope
Build graphs, compilation, packaging, caching, generated artifacts, and build dependencies.
## MUST
- Builds MUST produce correct artifacts from declared inputs and dependencies.
- Build failures MUST identify the failing action with actionable diagnostics.
- Cache correctness MUST take precedence over cache hit rate.
- Changes affecting artifact semantics MUST be validated from a clean build.
## MUST NOT
- MUST NOT depend on undeclared local files, ambient credentials, or stale generated output.
- MUST NOT trade correctness for benchmark-only speed gains.
- MUST NOT publish artifacts from a failed or partially validated build.
## SHOULD
- Build work SHOULD be incremental, parallel, and cacheable when correctness permits.
- Performance work SHOULD target measured critical paths.
## Exceptions
Non-hermetic dependencies require documented reason, risk, invalidation strategy, and owner approval where they affect releases.
## Verification
Use clean/repeated builds, cache-hit and cache-miss tests, artifact comparison, CI validation, dependency inspection, and before/after timing evidence.