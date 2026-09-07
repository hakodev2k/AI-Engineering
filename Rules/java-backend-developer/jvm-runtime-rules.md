# JVM Runtime Rules

## Purpose
Keep JVM behavior observable, capacity-aware, and compatible with production constraints.

## Scope
Applies to JVM configuration, memory, garbage collection, class loading, and runtime diagnostics.

## MUST
- JVM sizing MUST account for heap and non-heap memory, native allocations, thread stacks, container limits, and safety margin.
- Runtime tuning MUST be based on measured workload evidence such as allocation rate, pause time, CPU, heap occupancy, and latency.
- Production JVM flags MUST be version-compatible and managed as reviewed configuration.
- Memory or CPU incidents MUST preserve diagnostic evidence when safe, including GC logs, profiles, heap data, or thread dumps as appropriate.

## MUST NOT
- MUST NOT claim a GC or JVM flag improves performance without before/after evidence.
- MUST NOT size heap equal to a container memory limit without accounting for non-heap consumption.
- MUST NOT enable expensive diagnostics indefinitely without assessing overhead and sensitive-data exposure.

## SHOULD
- Prefer current supported JVM defaults unless evidence justifies tuning.
- Establish representative load tests before changing collectors or major memory settings.

## Exceptions
Emergency runtime changes require bounded scope, rollback criteria, incident documentation, and retrospective validation.

## Verification
Inspect effective JVM flags, container limits, GC/runtime telemetry, profiles, load-test results, and deployment configuration. Compare p50/p95/p99 latency, throughput, CPU, memory, and pauses before accepting tuning.