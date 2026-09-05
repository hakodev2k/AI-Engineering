# Device Targeting Rules

## Purpose
Ensure edge AI features are engineered against explicit device capabilities rather than an assumed generic target.

## Scope
Supported device classes, OS versions, CPU/GPU/NPU capabilities, memory, storage, sensors, and deployment constraints.

## MUST
- Supported device classes MUST define minimum compute, memory, storage, OS, and accelerator capabilities.
- Capability detection MUST occur before selecting an execution path that depends on optional hardware.
- Unsupported devices MUST fail safely or use an approved fallback.
- Device-specific assumptions MUST be documented and covered by representative tests.

## MUST NOT
- MUST NOT assume emulator or flagship-device behavior represents the supported fleet.
- MUST NOT enable hardware-specific paths without capability checks.

## SHOULD
- Maintain a device capability matrix and test high-impact edge cases across tiers.

## Exceptions
Exceptions require scope, affected devices, risk, evidence, fallback, and approval.

## Verification
Inspect capability checks, device matrices, hardware test results, and fallback behavior.