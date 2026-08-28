# Driver and Runtime Rules

## Purpose
Maintain compatible, secure accelerator software stacks.

## Scope
Applies to GPU drivers, accelerator firmware, container runtimes, CUDA-equivalent stacks, kernels, and libraries.

## MUST
- Supported driver, firmware, kernel, and runtime combinations MUST be documented and version-controlled.
- Upgrades MUST be validated against representative training and inference workloads.
- Security fixes MUST be evaluated against compatibility and operational risk.
- Rollback paths MUST exist for runtime changes that can affect fleet stability.

## MUST NOT
- MUST NOT upgrade production accelerator drivers fleet-wide without staged validation.
- MUST NOT rely on undocumented compatibility between runtime and driver versions.
- MUST NOT suppress runtime health failures merely to keep nodes schedulable.

## SHOULD
- Node images SHOULD minimize mutable host configuration.
- Compatibility matrices SHOULD be automated where practical.

## Exceptions
Exceptions require compatibility evidence, risk assessment, expiry, and approval.

## Verification
Inspect version inventories, compatibility tests, security scan results, staged rollout evidence, node health, and rollback records.