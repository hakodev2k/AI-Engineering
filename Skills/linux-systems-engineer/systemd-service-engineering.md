# systemd Service Engineering

## Purpose
Design, operate, and troubleshoot reliable systemd-managed services with explicit dependencies, lifecycle, security, and recovery behavior.

## When to use
Use when creating units, debugging startup failures, hardening daemons, or correcting restart/dependency behavior.

## Inputs
Executable behavior, environment/configuration, dependencies, users, ports, files, startup/shutdown semantics, and reliability requirements.

## Context to inspect
Inspect existing units/drop-ins, journal, dependency graph, targets, environment files, permissions, resource controls, and packaging conventions.

## Core knowledge
Understand unit states, ordering vs requirement dependencies, service types, restart policies, watchdogs, socket activation, sandboxing, resource controls, and daemon-reload semantics.

## Procedure
1. Define lifecycle and dependency requirements.
2. Inspect existing unit conventions and ownership.
3. Choose correct service type and execution user.
4. Encode requirement and ordering dependencies separately.
5. Set graceful stop, timeout, restart, and rate-limit behavior.
6. Add least-privilege hardening compatible with the service.
7. Add resource controls where justified.
8. Validate unit syntax and dependency graph.
9. Test start, stop, restart, failure, boot, and shutdown paths.
10. Verify logs and monitoring.

## Decision points
Use restart-on-failure for recoverable crashes, not permanent configuration errors. Prefer drop-ins for managed vendor units. Use socket activation only when its lifecycle semantics fit.

## Common failure patterns
Using After= as a requirement, restart loops, secrets in unit files, running as root unnecessarily, shell-dependent ExecStart commands, and missing graceful shutdown.

## Verification
Unit validates; boot ordering works; failure recovery is bounded; privileges are minimal; logs and health checks show expected behavior.

## Expected output
Maintainable unit configuration with tested lifecycle and operational evidence.

## Stop conditions
Stop if service ownership is unclear, credentials cannot be supplied safely, or restart/dependency changes may create boot-critical failure without recovery access.