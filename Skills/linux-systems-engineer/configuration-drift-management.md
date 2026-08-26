# Configuration Drift Management

## Purpose
Keep Linux fleet state reproducible by detecting and eliminating unmanaged configuration drift.

## When to use
Use for inconsistent hosts, recurring manual fixes, failed deployments, compliance variance, or configuration-management adoption.

## Inputs
Desired-state source, host inventory, configuration-management system, package/service/file state, and exception policy.

## Context to inspect
Inspect automation ownership, local overrides, package repositories, systemd drop-ins, sysctl, users, scheduled jobs, mounts, firewall, and mutable application state.

## Core knowledge
Desired state must have an authoritative source. Drift can be intentional, emergency, generated, or accidental; remediation must distinguish these classes before overwriting state.

## Procedure
1. Define authoritative configuration sources.
2. Inventory high-risk mutable host state.
3. Compare representative hosts against desired state.
4. Classify differences as valid exception, generated state, or drift.
5. Encode legitimate changes in automation before rollout.
6. Remove obsolete manual overrides safely.
7. Add continuous drift detection for critical controls.
8. Test convergence and idempotency.
9. Document exception ownership and expiry.

## Decision points
Rebuild immutable hosts when cheaper/safer than convergence; remediate in place when stateful recovery demands it. Never overwrite unknown drift blindly.

## Common failure patterns
Manual snowflake servers, two tools owning the same file, auto-remediating unknown differences, undocumented emergency edits, and storing secrets in plain configuration.

## Verification
Repeated convergence produces no unexpected changes, hosts match intended state, exceptions are explicit, and rebuild/replacement yields equivalent behavior.

## Expected output
Authoritative desired state, drift report, remediated differences, and managed exceptions.

## Stop conditions
Stop if ownership conflicts between automation systems are unresolved or drift may represent active incident/security evidence.