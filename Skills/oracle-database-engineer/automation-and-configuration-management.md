# Automation and Configuration Management

## Purpose
Automate Oracle provisioning and operations safely with idempotency, versioned configuration, secret protection, validation, and bounded failure behavior.

## When to use
Use for database builds, patch orchestration, user/schema provisioning, backup checks, monitoring configuration, and repetitive fleet operations.

## Inputs
Desired-state specification, infrastructure platform, Oracle versions, configuration standards, secret system, change-management requirements.

## Context to inspect
Existing scripts/IaC, parameter drift, OS prerequisites, inventory, wallets, credentials, cluster topology, and manual exceptions.

## Core knowledge
Database automation must respect stateful-system safety. Idempotency does not mean blindly re-running destructive SQL; preconditions, checkpoints, and postconditions are essential.

## Procedure
1. Define desired state and immutable versus mutable configuration.
2. Discover current state before applying changes.
3. Separate secrets from code and logs.
4. Make safe operations idempotent and destructive operations explicitly gated.
5. Validate Oracle/OS prerequisites and version compatibility.
6. Use transactions or compensating steps where supported.
7. Emit structured logs, correlation IDs, and changed/no-change results.
8. Add bounded retries only for transient operations.
9. Test automation on disposable and production-like environments.
10. Detect and report drift rather than silently overwriting unknown changes.

## Decision points
Automate high-frequency deterministic work first; keep rare high-blast-radius recovery steps human-approved while still scripting verification and evidence capture.

## Common failure patterns
Credentials in scripts, unbounded retries, shell success despite SQL errors, non-idempotent DDL, and configuration drift hidden by manual fixes.

## Verification
Run twice to prove safe convergence, inject failures, inspect rollback/partial-state handling, and compare final configuration to policy.

## Expected output
Versioned automation with safe preconditions, observability, and drift controls.

## Stop conditions
Stop when current state cannot be determined safely or automation would make irreversible changes without approval.