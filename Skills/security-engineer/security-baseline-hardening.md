# Security Baseline Hardening

## Purpose
Define and apply secure configuration baselines for operating systems, runtimes, databases, middleware, and platform services while preserving operational requirements.

## When to use
Use when provisioning new environments, standardizing production configuration, preparing audits, or reducing configuration-related attack surface.

## Inputs
Platform inventory, deployment manifests, configuration files, vendor guidance, approved benchmarks, business requirements, exception register.

## Context to inspect
Default accounts, services, ports, TLS settings, filesystem permissions, audit configuration, administrative interfaces, package versions, remote management, and startup behavior.

## Core knowledge
Hardening reduces unnecessary attack surface by disabling unused functionality, enforcing secure defaults, restricting privileges, and making configuration drift detectable. Baselines must be adapted to workload needs rather than copied blindly.

## Procedure
1. Inventory components and supported versions.
2. Identify applicable vendor and organizational hardening guidance.
3. Remove unnecessary services, protocols, modules, and default accounts.
4. Restrict administrative interfaces and remote management.
5. Enforce appropriate TLS, authentication, and file-permission settings.
6. Configure audit and security-relevant logs.
7. Document required deviations and compensating controls.
8. Encode stable settings in configuration management or IaC.
9. Test functionality and performance after hardening.
10. Add drift detection and periodic review.

## Decision points
Apply stronger restrictions to internet-facing and sensitive systems. Accept deviations only when required for supported functionality and residual risk is understood.

## Common failure patterns
Blindly applying benchmarks, breaking required services, one-time manual hardening, unsupported settings, ignored exceptions, and no drift detection.

## Verification
Configuration checks match the approved baseline, application tests pass, exposed services are minimized, and deviations are recorded with owners.

## Expected output
A documented, automated, and testable security baseline with approved exceptions and drift monitoring.

## Stop conditions
Escalate when required hardening conflicts with vendor support, critical functionality, or change-control requirements.