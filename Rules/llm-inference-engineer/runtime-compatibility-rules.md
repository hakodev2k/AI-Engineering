# Runtime Compatibility Rules

## Purpose
Prevent production failures caused by incompatible model formats, kernels, drivers, libraries, devices, or inference-engine behavior.

## Scope
Applies to inference runtimes, CUDA or accelerator stacks, kernels, compilers, serving frameworks, model formats, and hardware-specific execution paths.

## MUST
- Production runtime versions MUST be pinned or otherwise reproducibly resolved.
- Supported combinations of model architecture, runtime, accelerator, driver, precision, and kernel path MUST be documented and validated.
- Runtime upgrades MUST pass compatibility, correctness, latency, memory, and load tests before rollout.
- Hardware-specific optimizations MUST have a validated fallback path or documented operational response when unavailable.
- Changes to low-level kernels or execution engines MUST include numerical-correctness checks against an accepted baseline.

## MUST NOT
- MUST NOT upgrade drivers, accelerator libraries, model format, or inference runtime directly in production without validation.
- MUST NOT assume a runtime supports a model feature because another runtime does.
- MUST NOT suppress unsupported-operation warnings when they may change semantics or performance.
- MUST NOT rely on undocumented runtime behavior for correctness-critical output.

## SHOULD
- Compatibility matrices SHOULD be automated and exercised in CI or pre-production qualification.
- Runtime changes SHOULD be isolated from model changes when practical so regressions can be attributed accurately.

## Exceptions
An exception requires the exact unsupported combination, evidence of safe behavior, operational mitigations, rollback steps, and explicit approval for production use.

## Verification
Review pinned dependency manifests, runtime startup logs, compatibility test results, numerical comparisons, device telemetry, and deployment records. Confirm production resolves only approved combinations.