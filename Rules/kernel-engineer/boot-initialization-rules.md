# Boot and Initialization Rules

## Purpose
Keep startup deterministic, diagnosable, dependency-safe, and recoverable.

## Scope
Early boot, initialization ordering, discovery, initcalls, CPU bring-up, and subsystem readiness.

## MUST
- Initialization dependencies MUST be explicit rather than relying on incidental ordering.
- Early-boot code MUST use only facilities guaranteed to be available at that phase.
- Initialization failure MUST leave the system in a defined state or stop with actionable diagnostics when continuation is unsafe.
- Per-CPU and shared initialization MUST account for secondary CPU bring-up and hotplug where supported.
- Boot-critical changes MUST consider recovery and diagnostic paths.

## MUST NOT
- MUST NOT depend on allocator, scheduler, filesystem, device, or logging facilities before their documented readiness.
- MUST NOT hide boot failures behind silent fallback when the fallback changes safety or integrity semantics.
- MUST NOT create circular initialization dependencies.

## SHOULD
- Boot paths SHOULD minimize global ordering constraints.
- Optional facilities SHOULD fail independently when safe degradation is possible.
- Initialization diagnostics SHOULD identify the failing stage and dependency.

## Exceptions
Exceptions require explicit phase guarantees, dependency analysis, failure behavior, and maintainer approval.

## Verification
Test cold/warm boot, minimal configurations, missing hardware, partial initialization failure, CPU hotplug where applicable, and recovery boot modes.