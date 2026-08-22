# Platform Boundary Rules
## Purpose
Keep mobile platform dependencies explicit, isolated, and replaceable.
## Scope
Shared code, native APIs, device services, platform-specific implementations, and abstraction boundaries.
## MUST
- Platform-specific behavior MUST be isolated behind explicit interfaces or modules when shared application logic depends on it.
- Platform capability differences MUST be modeled deliberately rather than hidden by assumptions.
- Native resource ownership and lifecycle requirements MUST be documented at integration boundaries.
## MUST NOT
- Business rules MUST NOT depend directly on UI framework or device APIs without a justified boundary.
- Unsupported platform behavior MUST NOT silently degrade into incorrect behavior.
## SHOULD
- Shared abstractions SHOULD expose product intent rather than mirror low-level native APIs.
## Exceptions
Direct native integration is acceptable for narrowly scoped code when abstraction would add no reuse or safety; rationale and test coverage are required.
## Verification
Review dependency direction, platform build targets, capability tests, and architecture tests where practical.