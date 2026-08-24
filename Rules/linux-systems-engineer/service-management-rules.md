# Service Management Rules

## Purpose
Ensure host services start, stop, restart, recover, and fail in controlled ways.

## Scope
Applies to systemd units and equivalent init/service-management mechanisms, dependencies, timers, restart policies, and resource controls.

## MUST
- Service definitions MUST declare required dependencies, execution identity, environment/configuration sources, and restart behavior intentionally.
- Service changes MUST distinguish reload-safe changes from restart-required changes.
- Restart policies MUST avoid unbounded crash loops and MUST expose persistent failure to monitoring.
- Critical services MUST define startup ordering only where a real dependency exists; readiness MUST NOT be inferred solely from process existence.
- Resource limits MUST be explicit when runaway consumption could threaten the host.

## MUST NOT
- Production services MUST NOT run as root when required capabilities can be safely scoped otherwise.
- Failure output MUST NOT be redirected to an unmonitored sink.
- A service MUST NOT be repeatedly restarted as a substitute for investigating a recurring failure.

## SHOULD
- Use native sandboxing and capability restrictions where compatible.
- Prefer graceful reload/restart patterns that respect redundancy and connection draining.
- Keep unit overrides minimal and version controlled.

## Exceptions
Temporary operational overrides require an owner, expiry condition, reason, and reconciliation into managed configuration or removal.

## Verification
Inspect effective unit configuration, dependency graph, execution identity, restart counters, logs, resource controls, enablement state, and behavior under process failure and host reboot.