# Platform Portability Rules

## Purpose
Prevent unnecessary coupling between model behavior and one device vendor, runtime, or operating-system implementation.

## Scope
Model formats, runtime abstractions, device delegates, platform APIs, and vendor-specific optimizations.

## MUST
- Vendor-specific execution paths MUST be isolated behind explicit compatibility boundaries.
- A portability trade-off MUST be documented when an optimization intentionally narrows supported platforms.
- Model semantics MUST remain consistent across supported execution paths within approved tolerances.
- Platform-specific code MUST have representative tests on the affected platform.

## MUST NOT
- MUST NOT introduce hidden vendor lock-in through undocumented proprietary model transforms or APIs.
- MUST NOT claim cross-platform support without testing materially different execution paths.

## SHOULD
- Prefer portable model representations and standard operators when performance requirements permit.

## Exceptions
Require measurable benefit, affected platform scope, migration risk, and approval.

## Verification
Inspect architecture boundaries, model formats, platform-specific dependencies, compatibility tests, and benchmark evidence.