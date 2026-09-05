# Training Dependency and Kernel Rules

## Purpose
Prevent framework, compiler, driver, and custom-kernel changes from silently altering training correctness.

## Scope
Training frameworks, distributed libraries, accelerator runtimes, compilers, drivers, fused operations, custom kernels, and container images.

## MUST
- Runtime and dependency versions MUST be pinned or immutably identified for release-relevant runs.
- New or upgraded kernels affecting model math MUST receive correctness/parity tests against a trusted implementation on representative inputs.
- Dependency upgrades MUST be assessed for checkpoint compatibility, numerical behavior, distributed semantics, and performance.
- Security-critical dependency issues MUST have a documented remediation or accepted-risk decision.
- Environment images MUST be traceable to their build inputs.

## MUST NOT
- MUST NOT adopt a faster kernel based on throughput alone when numerical correctness has not been validated.
- MUST NOT change core training dependencies during a controlled comparison without disclosure.
- MUST NOT disable integrity or security controls to make a dependency install succeed.

## SHOULD
- Major upgrades SHOULD be canaried on short runs before large-scale use.
- Custom kernels SHOULD include shape, dtype, boundary, and gradient tests.

## Exceptions
Temporary research patches require explicit versioning and MUST NOT be represented as standard production environment behavior.

## Verification
Inspect lockfiles/images, driver/runtime records, kernel tests, parity tolerances, upgrade reports, vulnerability scans, and canary results.