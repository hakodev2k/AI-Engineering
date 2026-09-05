# Device Fleet Testing Rules

## Purpose
Provide representative evidence that edge AI releases behave correctly across the supported device fleet.

## Scope
Physical-device tests, emulators, device farms, OS versions, hardware tiers, and regression coverage.

## MUST
- Critical release paths MUST run on representative physical hardware for every materially different device tier.
- Test selection MUST cover hardware, OS, runtime, and model combinations that can change behavior.
- Release tests MUST include startup, repeated inference, degraded-resource, and update scenarios where relevant.
- Failures specific to a supported device tier MUST block that tier unless explicitly excluded or accepted.

## MUST NOT
- MUST NOT use emulators as the sole evidence for hardware-dependent behavior.
- MUST NOT declare fleet compatibility from one reference device.

## SHOULD
- Prioritize test coverage using production fleet distribution and incident history.

## Exceptions
Require missing coverage, risk, alternative evidence, and approval.

## Verification
Inspect device matrices, test results, physical-hardware evidence, failure history, and release gates.