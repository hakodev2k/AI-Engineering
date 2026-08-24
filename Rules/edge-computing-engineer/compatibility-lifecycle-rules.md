# Compatibility and Lifecycle
## Purpose
Manage long-lived heterogeneous hardware and software without unsafe version fragmentation.
## Scope
Hardware revisions, operating systems, protocols, APIs, firmware, and application versions.
## MUST
- Supported compatibility matrices MUST be explicit and testable.
- Breaking protocol or data changes MUST have migration and coexistence strategy before rollout.
- End-of-support decisions MUST account for nodes that may remain offline through transition windows.
## MUST NOT
- MUST NOT assume fleet-wide simultaneous upgrades.
- MUST NOT remove compatibility required by still-supported deployed nodes without approved migration.
## SHOULD
- Protocols SHOULD use additive evolution and capability negotiation where practical.
## Exceptions
Forced retirement requires documented impact, communication, recovery options, and approval.
## Verification
Run mixed-version tests, inspect compatibility matrices, simulate delayed upgrades, and review deprecation telemetry.