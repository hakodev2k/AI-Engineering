# Temporary Workspace Rules
## Purpose
Control performance risks from temporary tables, sorts, hashes, spills, and transient workspace.
## Scope
Temporary databases, scratch space, temp tables, intermediate results, and work files.
## MUST
- Measure temporary-space consumption and I/O for workloads known to spill or materialize large intermediates.
- Bound temporary object lifetime and clean up explicitly when the platform requires it.
- Capacity temporary storage for peak concurrent operations and recovery scenarios.
## MUST NOT
- Move work to temporary storage merely to hide inefficient plans.
- Permit unbounded intermediate-result growth in production-critical paths.
## SHOULD
- Prefer set shapes and memory grants that avoid unnecessary spills when evidence supports the change.
## Exceptions
Batch workloads may consume larger temporary capacity inside approved resource windows.
## Verification
Inspect temp-space telemetry, plans, spill warnings, workload tests, and storage capacity alarms.