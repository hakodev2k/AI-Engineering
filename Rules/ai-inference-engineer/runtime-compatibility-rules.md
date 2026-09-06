# Runtime Compatibility Rules

## Purpose
Prevent production failures caused by incompatibilities between model artifacts, serving runtimes, kernels, drivers, and hardware.

## Scope
Model formats, runtime versions, accelerator drivers, kernels, compiler artifacts, custom operators, and deployment images.

## MUST
- Production model artifacts MUST declare compatible runtime and hardware requirements.
- Runtime, driver, and custom-kernel upgrades MUST be validated against representative production models before rollout.
- Custom operators MUST have deterministic versioning and compatibility checks.
- Deployment images MUST pin critical runtime dependencies to reviewed versions.
- Compatibility failures MUST be detectable before traffic reaches the affected deployment.

## MUST NOT
- MUST NOT rely on floating runtime versions for production serving.
- MUST NOT assume a model exported successfully implies it will execute correctly on every target accelerator.
- MUST NOT bypass compatibility checks merely to accelerate deployment.

## SHOULD
- Maintain a compatibility matrix for supported model formats, runtimes, and hardware classes.
- Prefer standard operators when performance and correctness requirements allow.

## Exceptions
Exceptions require documented compatibility evidence, bounded scope, rollback plan, and approval.

## Verification
Inspect image manifests, dependency locks, compatibility tests, hardware test results, and deployment gates.