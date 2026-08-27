# Secure Cluster Upgrades

## Purpose
Upgrade Kubernetes and security-critical add-ons without creating compatibility gaps, disabling controls, or losing rollback capability.

## When to use
Use for Kubernetes minor upgrades, node-image refreshes, CNI/CSI/admission upgrades, and deprecated API removal.

## Inputs
Current/target versions, compatibility matrices, API usage, admission policies, add-ons, maintenance constraints, and rollback/recovery plans.

## Preconditions
Have tested backups/recovery and a representative non-production environment.

## Context to inspect
Inspect removed APIs, feature gates, admission behavior, RBAC changes, security defaults, CNI/CSI compatibility, node skew rules, webhook versions, and policy engines.

## Core knowledge
Security controls can fail open or become incompatible during upgrades. Version skew and API removal require staged sequencing rather than a single binary change.

## Procedure
1. Inventory components and version dependencies.
2. Read target-version security/deprecation changes.
3. Detect deprecated API usage.
4. Test policies, webhooks, workloads, and networking on target version.
5. Validate backup/restore and rollback constraints.
6. Upgrade control plane according to supported skew.
7. Progressively replace/upgrade nodes and add-ons.
8. Re-run security baseline and negative tests.
9. Remove temporary compatibility exceptions.

## Decision points
Delay only when known incompatibility risk exceeds current-version security risk and compensating controls exist. Prefer supported incremental upgrade paths.

## Common failure patterns
Skipping versions unsupported by provider; disabling admission to make upgrades pass; leaving old nodes indefinitely; ignoring CRD/webhook compatibility.

## Verification
Confirm versions, node health, policy enforcement, network isolation, audit logging, and representative workload behavior after upgrade.

## Expected output
A supported upgraded cluster with security controls proven operational.

## Stop conditions
Pause rollout on control-plane instability, policy bypass, network isolation regression, or unrecoverable data-path risk.