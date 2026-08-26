# Package and Patching Lifecycle

## Purpose
Maintain Linux packages and security patches predictably without creating unmanaged drift or avoidable outages.

## When to use
Use for patch cycles, vulnerability remediation, repository changes, package conflicts, or OS lifecycle planning.

## Inputs
Distribution/version, repositories, package inventory, vulnerability data, maintenance window, application dependencies, and rollback strategy.

## Context to inspect
Inspect repository configuration, pins/holds, kernel packages, third-party packages, support lifecycle, immutable-image practices, and configuration management ownership.

## Core knowledge
Understand dependency resolution, signed repositories, package provenance, kernel/userspace restart requirements, version pinning, transactional/immutable approaches, and staged rollout.

## Procedure
1. Inventory installed and externally managed packages.
2. Validate repository trust and support status.
3. Identify security and functional updates.
4. Determine restart/reboot requirements and dependency risk.
5. Test updates on representative non-production systems.
6. Define rollback or replacement-image path.
7. Roll out progressively with health gates.
8. Reboot when required under controlled procedure.
9. Verify versions, services, security status, and drift.

## Decision points
Prefer image replacement for immutable fleets; in-place patching for appropriately managed mutable hosts. Pin only when compatibility evidence justifies accepting patch lag.

## Common failure patterns
Blind full upgrades, unsigned repositories, indefinite holds, patching without reboot planning, mixing package managers, and manual changes outside configuration management.

## Verification
Confirm expected versions, healthy services, resolved vulnerabilities, repository integrity, reboot state, and no configuration drift.

## Expected output
Patch plan, executed changes, exceptions, rollback path, and verification evidence.

## Stop conditions
Stop for unsupported repositories, unresolved dependency removals, missing rollback path for critical hosts, or application compatibility requiring owner approval.