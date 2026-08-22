# Platform API and Deprecation Rules
## Purpose
Prevent mobile applications from accumulating unsupported platform dependencies.
## Scope
OS SDK APIs, deprecated behavior, target SDK changes, entitlements, and compatibility transitions.
## MUST
- Deprecated APIs affecting security, policy, or future compatibility MUST have an owner and migration plan.
- Target/minimum SDK changes MUST be evaluated for behavior changes, permissions, storage, networking, and background execution.
- New platform APIs MUST include availability guards for supported older versions.
## MUST NOT
- Deprecation warnings with known removal timelines MUST NOT be ignored indefinitely.
- Private or undocumented platform APIs MUST NOT be used for production functionality without explicit legal/policy approval.
## SHOULD
- Platform release betas SHOULD be evaluated early for high-risk applications.
## Exceptions
Temporary deprecated API use requires documented necessity, compatibility coverage, and removal trigger.
## Verification
Compile against current SDKs, inspect deprecations, run target-version tests, and review platform migration notes.