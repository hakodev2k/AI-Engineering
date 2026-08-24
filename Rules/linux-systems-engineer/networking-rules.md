# Host Networking Rules

## Purpose
Maintain correct, diagnosable, and secure Linux host connectivity.

## Scope
Applies to interfaces, routes, DNS, bonding, VLANs, MTU, firewall integration, sockets, and network namespaces at host level.

## MUST
- Network changes MUST identify management-path risk and preserve a recovery path before remote execution.
- Addressing, routing, DNS, MTU, and interface configuration MUST be managed persistently rather than only changed at runtime.
- Connectivity failures MUST be investigated layer by layer using observable evidence such as link state, routes, neighbor state, DNS results, socket state, and packet traces when appropriate.
- Multi-homed hosts MUST have explicit routing and source-address behavior.
- Firewall changes affecting exposure MUST be reviewed against intended service boundaries.

## MUST NOT
- A default route or management interface MUST NOT be replaced remotely without validated out-of-band or automatic rollback capability.
- DNS failures MUST NOT be worked around by permanently hard-coding addresses unless the dependency contract permits it.
- Firewalls MUST NOT be disabled wholesale to diagnose a single connectivity issue.

## SHOULD
- Prefer declarative network configuration.
- Keep packet captures bounded and protect sensitive payloads.
- Test path MTU and asymmetric routing when symptoms warrant it.

## Exceptions
Emergency connectivity restoration may use temporary runtime changes if they are recorded, time-bounded, and reconciled into persistent configuration after stabilization.

## Verification
Inspect interface and route state, persistent network configuration, resolver behavior, listening sockets, firewall rules, reachability from relevant zones, and monitoring after change.