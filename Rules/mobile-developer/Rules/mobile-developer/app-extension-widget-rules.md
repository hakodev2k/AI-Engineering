# App Extension and Widget Rules
## Purpose
Keep widgets, extensions, share targets, watch components, and other auxiliary processes safe under strict lifecycle limits.
## Scope
App extensions, widgets, companion components, shared containers, and cross-process data.
## MUST
- Extension code MUST respect its independent lifecycle, memory, time, and permission constraints.
- Shared data containers MUST define synchronization and access ownership across processes/components.
- Extension entry points MUST validate untrusted external input and current authorization.
## MUST NOT
- Extensions MUST NOT assume the main app process is alive or initialized.
- Sensitive shared storage MUST NOT be broadened merely for implementation convenience.
## SHOULD
- Shared logic SHOULD remain framework-independent when reused by app and extension targets.
## Exceptions
Tightly coupled companion components may share more implementation when platform guarantees and test coverage justify it.
## Verification
Test independent launch, stale shared data, concurrent access, memory/time limits, logout, and extension-disabled states.