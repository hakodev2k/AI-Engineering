# GPU Driver and Runtime Compatibility Rules

## Purpose
Prevent fleet outages and workload regressions caused by incompatible GPU drivers, runtimes, firmware, libraries, or framework expectations.

## Scope
Applies to accelerator drivers, firmware, CUDA-class runtimes, communication libraries, kernel compatibility, and workload images.

## MUST
- Supported driver, firmware, runtime, kernel, and communication-library combinations MUST be documented and version-controlled.
- Compatibility changes MUST be validated against representative training, inference, multi-GPU, and diagnostic workloads before broad rollout.
- Rollouts MUST be staged with health gates and a tested rollback path.
- Workload images MUST declare runtime assumptions that materially affect execution.
- Fleet inventory MUST expose effective versions and incompatibility drift.

## MUST NOT
- A driver or firmware upgrade MUST NOT be deployed fleet-wide solely because a newer version exists.
- Host/runtime compatibility MUST NOT depend on undocumented manual fixes.
- Unsupported version mixing MUST NOT be normalized without evidence, ownership, and an exit plan.

## SHOULD
- Compatibility matrices SHOULD include accelerator generation and operating-system differences.
- Canary pools SHOULD represent production hardware diversity.

## Exceptions
Exceptions require vendor or empirical compatibility evidence, bounded scope, monitoring, rollback, and owner approval.

## Verification
Review version inventories, compatibility matrices, canary results, workload tests, node health, incident history, and rollback exercises.