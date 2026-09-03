# Runtime and Dependency Rules

## Purpose
Control compatibility and operational risk across serving runtimes, kernels, drivers, libraries, and system dependencies.

## Scope
Applies to inference engines, CUDA or accelerator stacks, drivers, communication libraries, container bases, and supporting packages.

## MUST
- Pin production runtime and dependency versions to reviewed, reproducible releases.
- Validate compatibility across model format, accelerator hardware, drivers, kernels, and inference runtime before rollout.
- Test material dependency upgrades with representative correctness, performance, and stability workloads.
- Track security advisories and known incompatibilities for critical serving dependencies.

## MUST NOT
- Upgrade major runtime or driver versions directly in production without staged validation.
- Assume API compatibility implies numerical, performance, or memory-behavior compatibility.
- Use unmaintained critical dependencies without documented risk acceptance and mitigation.

## SHOULD
- Keep dependency sets minimal and automate compatibility checks where feasible.
- Maintain rollback-compatible images for high-risk runtime upgrades.

## Exceptions
Urgent security upgrades may use accelerated validation when residual risk, rollback, and approval are documented.

## Verification
Review lockfiles and image manifests, compatibility matrices, vulnerability reports, regression tests, benchmarks, and staged rollout evidence.