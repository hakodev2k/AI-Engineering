# Secure Database Configuration

## Purpose
Establish hardened database defaults that reduce unnecessary attack surface while preserving required functionality.

## When to use
Use for provisioning, baseline reviews, upgrades, configuration drift, or security findings.

## Inputs
Engine/version, vendor guidance, organizational baseline, extensions, network model, workload requirements, and current settings.

## Context to inspect
Inspect listeners, remote administration, extensions, authentication modes, dangerous features, file access, logging, default accounts, and runtime parameters.

## Core knowledge
Hardening is workload-specific. Disabling unused capabilities reduces attack surface, but unsupported changes can harm availability or operability. Configuration should be reproducible and drift-detectable.

## Procedure
1. Establish supported version and patch level.
2. Compare effective settings to approved baselines.
3. Disable unused listeners, protocols, extensions, and sample accounts.
4. Harden authentication and administrative interfaces.
5. Restrict filesystem, external command, and network-capable features.
6. Configure security logging.
7. Encode settings in managed configuration where practical.
8. Stage and test changes.
9. Monitor drift and exceptions.

## Decision points
Retain a risky feature only when a verified business dependency exists and compensating controls are defined. Prefer preventive policy for high-confidence unsafe states.

## Common failure patterns
Copying generic benchmarks without workload analysis, undocumented console changes, leaving default accounts, enabling powerful extensions globally, and hardening without rollback plans.

## Verification
Compare effective configuration, run connectivity and workload tests, and confirm drift detection.

## Expected output
A tested hardened baseline with documented exceptions.

## Stop conditions
Escalate when a baseline change risks availability, violates vendor support, or requires coordinated application changes.