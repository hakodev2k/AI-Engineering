# Runtime Compatibility Rules

## Purpose
Prevent runtime-specific assumptions from undermining portability or production correctness.

## Scope
Applies to engines, browsers, server runtimes, feature flags, proposals, and runtime configuration.

## MUST
- The supported runtime and version matrix MUST be explicit.
- Required WebAssembly features MUST be detected or constrained by deployment policy.
- Production artifacts MUST be tested on the runtime configurations used in production.
- Runtime upgrades MUST be evaluated for semantic, performance, security, and resource-limit changes.
- Unsupported feature use MUST fail predictably rather than degrade silently.

## MUST NOT
- Successful execution on one engine MUST NOT be treated as proof of portable behavior.
- Experimental features MUST NOT become production dependencies without compatibility and rollback analysis.
- Runtime defaults MUST NOT be assumed stable across versions when they affect security or resource behavior.

## SHOULD
- Maintain conformance tests independent of a single engine.
- Pin runtime versions or compatibility ranges intentionally.
- Keep runtime-specific optimizations isolated and benchmarked.

## Exceptions
Single-runtime systems may narrow the matrix, but the dependency must be documented and upgrades still require regression testing.

## Verification
Execute CI against the declared runtime matrix, inspect feature requirements, run conformance and regression suites after runtime upgrades, and compare runtime configuration with deployment documentation.