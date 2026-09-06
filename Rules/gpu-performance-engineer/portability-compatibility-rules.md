# Portability and Compatibility Rules

## Purpose
Prevent performance work from binding workloads accidentally to one accelerator, driver, or runtime configuration.

## Scope
GPU architectures, drivers, runtimes, compiler versions, libraries, capability checks, and fallback paths.

## MUST
- Architecture-specific optimizations MUST declare supported device capabilities and runtime requirements.
- Unsupported hardware or software combinations MUST fail clearly or use a validated fallback.
- Dependency upgrades affecting generated code or kernels MUST receive correctness and performance regression testing.
- Benchmarks MUST identify accelerator architecture and relevant software versions.

## MUST NOT
- MUST NOT execute unsupported instructions or assumptions without capability guards.
- MUST NOT silently fall back to dramatically slower execution in production-critical paths without observability.
- MUST NOT claim portability from compilation success alone.

## SHOULD
- SHOULD keep architecture-specific code behind narrow interfaces.
- SHOULD maintain representative tests across supported hardware generations.

## Exceptions
Single-platform optimizations require explicit scope, rationale, and migration impact documentation.

## Verification
Review capability checks, compatibility matrices, CI or hardware test results, fallback telemetry, and dependency regression benchmarks.