# Cluster Upgrades

## Purpose
Plan and execute Kubernetes version and node upgrades with compatibility checks, staged validation, and rollback/recovery paths.

## When to use
Control-plane/node upgrades, managed-cluster version changes, or deprecated API remediation.

## Inputs
Current/target versions, add-ons, APIs, workloads, maintenance windows, SLOs, and provider constraints.

## Context to inspect
Deprecated APIs, admission webhooks, CRDs/controllers, CNI/CSI, node images, PDBs, and version-skew rules.

## Core knowledge
Upgrade risk often comes from ecosystem compatibility rather than Kubernetes core. API removals and webhook/add-on incompatibilities must be found before production.

## Procedure
1. Read target-version breaking changes.
2. Inventory deprecated/removed APIs.
3. Validate controllers, CRDs, CNI, CSI, and observability stack.
4. Upgrade non-production first.
5. Run workload and disruption tests.
6. Stage production control-plane and node upgrades.
7. Observe SLOs and platform signals between stages.
8. Complete node replacement and post-upgrade validation.

## Decision points
Prefer incremental supported versions when required; choose surge or replacement strategy based on capacity and provider behavior.

## Common failure patterns
Skipping API scans, ignoring webhook compatibility, insufficient drain capacity, and treating control-plane success as full validation.

## Verification
All nodes/components reach supported versions, workloads pass tests, and deprecated APIs are absent.

## Expected output
Upgrade record with compatibility evidence and residual risks.

## Stop conditions
Stop on incompatible critical add-ons or failed pre-production validation.