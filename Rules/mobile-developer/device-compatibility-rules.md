# Device Compatibility Rules
## Purpose
Control behavior across supported OS versions, screen classes, hardware capabilities, and device tiers.
## Scope
OS support, feature detection, hardware variance, screen configuration, and compatibility fallbacks.
## MUST
- Supported OS/device policy MUST be explicit and tied to tested configurations.
- Runtime capability detection MUST be used when availability can differ within a supported OS range.
- Unsupported hardware-dependent features MUST fail safely with understandable alternatives.
## MUST NOT
- OS version checks MUST NOT substitute for capability checks when APIs provide reliable capability detection.
- High-end development devices MUST NOT be the only performance validation target.
## SHOULD
- Test matrices SHOULD prioritize user distribution, risk, and known platform fragmentation.
## Exceptions
Rare device combinations may receive reduced coverage based on documented risk and usage evidence.
## Verification
Review support matrix, device-lab results, capability fallbacks, screen configurations, and representative low-resource devices.