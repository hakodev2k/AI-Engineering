# Windows Server Administration

## Purpose
Operate Windows Server estates safely, consistently, and supportably, including roles, features, services, configuration, patching, and lifecycle decisions.

## When to use
Use for provisioning or reviewing servers, changing OS configuration, diagnosing server behavior, or planning upgrades. Do not use as a substitute for application-specific runbooks.

## Inputs
Server role and criticality, supported Windows version, configuration baseline, dependencies, maintenance window, monitoring, backup state, and change requirements.

## Preconditions
Confirm authorization, recoverability, environment scope, and whether the host is clustered or otherwise production-critical.

## Context to inspect
Inventory installed roles/features, services, event logs, scheduled tasks, local policy, network configuration, storage, pending reboot state, patch level, resource pressure, and management tooling.

## Core knowledge
Prefer declarative and repeatable configuration over manual drift. Understand Server Core versus Desktop Experience, Windows servicing, role dependencies, service accounts, reboot semantics, and support lifecycle. Treat configuration changes as production changes with rollback and evidence.

## Procedure
1. Establish the server's business function and blast radius.
2. Capture current configuration and health before changing anything.
3. Check vendor and Microsoft support constraints.
4. Identify the minimum required role, feature, service, or setting change.
5. Validate dependencies, ports, identities, storage, and reboot requirements.
6. Define rollback and recovery steps.
7. Apply the change through the estate's approved management mechanism.
8. Reboot only when required and within the approved window.
9. Validate services, dependencies, logs, monitoring, and business health.
10. Record the resulting configuration and operational notes.

## Decision points
Choose Server Core when GUI dependencies are absent and reduced attack surface matters. Prefer centralized management and automation for fleet-wide changes; use interactive administration mainly for diagnosis or exceptional cases.

## Common failure patterns
Configuration drift, installing unnecessary features, unplanned reboots, changing production without baseline evidence, ignoring pending reboot state, weak rollback plans, and validating only that the server responds rather than that its workload is healthy.

## Verification
Implementation is complete when intended configuration is applied. Verification requires role/service health, clean relevant event logs, expected network/storage behavior, monitoring recovery, and application-level checks.

## Expected output
A supportable server configuration plus recorded validation and rollback evidence.

## Stop conditions
Stop for unsupported configurations, missing backups for risky work, unclear ownership, unavailable dependencies, insufficient privileges, or changes that exceed the approved blast radius.