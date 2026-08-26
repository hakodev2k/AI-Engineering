# Windows Security Hardening

## Purpose
Reduce Windows attack surface using risk-based, supportable hardening while preserving required workloads and operational recovery.

## When to use
Use for baseline creation, server onboarding, audit remediation, privileged-system reviews, or security posture improvement.

## Inputs
Workload, threat model, organizational baseline, regulatory requirements, Microsoft/vendor guidance, exception process, and test environment.

## Preconditions
Know business dependencies and rollback. Security changes that affect authentication, encryption, or remote administration require staged validation.

## Context to inspect
Local/domain policy, Defender configuration, firewall, installed roles/features, services, SMB settings, TLS configuration, audit policy, privilege assignments, local administrators, credential protections, and patch state.

## Core knowledge
Hardening is a system of controls, not a checklist. Prioritize least privilege, secure defaults, removal of obsolete protocols, credential protection, application control where appropriate, host firewalling, patching, auditing, and tamper resistance. Baselines must account for workload compatibility.

## Procedure
1. Classify workload and threat exposure.
2. Compare current state with the approved security baseline.
3. Rank gaps by exploitability, impact, exposure, and dependency risk.
4. Identify compatibility-sensitive controls and create tests.
5. Apply changes to a representative cohort.
6. Validate workload, authentication, management, backup, and monitoring paths.
7. Expand deployment progressively.
8. Record justified exceptions with owner and expiry/review date.
9. Monitor for drift and regressions.

## Decision points
Prefer disabling unused capability over merely monitoring it. Choose stronger controls only when operational recovery remains viable. Exceptions should be narrow and time-bound rather than weakening the global baseline.

## Common failure patterns
Copying a benchmark without workload analysis, disabling legacy protocols before dependency discovery, broad administrator exceptions, hardening that breaks recovery tooling, unaudited local changes, and assuming compliance equals security.

## Verification
Verify effective policy, exposed services/ports, privileged membership, endpoint protection state, workload tests, management access, and security telemetry.

## Expected output
A measured hardening change set with evidence, exceptions, and rollback path.

## Stop conditions
Stop when required compatibility cannot be tested, security ownership is absent, critical recovery channels would be lost, or a control change requires explicit risk approval.