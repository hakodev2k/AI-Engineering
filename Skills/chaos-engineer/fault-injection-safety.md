# Fault Injection Safety

## Purpose
Select and operate fault-injection mechanisms with explicit safety, reversibility, and authorization controls.

## When to use
Use before introducing latency, errors, resource pressure, process termination, network disruption, or dependency faults.

## Inputs
Fault objective, target environment, tooling, permissions, system topology, and safety constraints.

## Context to inspect
Inspect tool behavior, privilege level, cleanup semantics, target selection, auditability, and failure behavior of the injector itself.

## Core knowledge
The injection mechanism is part of the risk model. Prefer deterministic targeting, bounded duration, automatic cleanup, least privilege, dry-run support, and independent termination controls.

## Procedure
1. Translate the hypothesis into the minimum required fault.
2. Validate target selectors against current infrastructure.
3. Confirm permissions are least-privileged.
4. Configure duration and automatic cleanup.
5. Establish a kill switch outside the affected path.
6. Dry-run targeting when supported.
7. Record experiment identity for logs and traces.
8. Inject and continuously monitor scope.
9. Remove the fault and verify cleanup.

## Decision points
Use application-level injection for precise behavior and infrastructure-level injection for platform failure realism. Avoid destructive mechanisms when reversible alternatives test the same hypothesis.

## Common failure patterns
Broad selectors, stale resource IDs, permanent firewall changes, uncontrolled stress tools, missing cleanup, and using production credentials unnecessarily.

## Verification
Confirm exact targets, injected behavior, audit records, successful fault removal, and restored baseline.

## Expected output
A safely executed and fully reversible fault injection with traceable evidence.

## Stop conditions
Stop for ambiguous targets, excessive privileges, non-reversible actions, missing kill controls, or unapproved destructive risk.