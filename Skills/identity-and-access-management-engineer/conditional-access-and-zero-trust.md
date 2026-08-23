# Conditional Access and Zero Trust

## Purpose
Design contextual access policies that continuously evaluate identity, device, location, risk, and resource sensitivity without relying on network location as trust.

## When to use
Use for remote access, privileged access, SaaS protection, device-based controls, and modernization of perimeter-centric access.

## Inputs
User populations, device posture, application sensitivity, network context, risk signals, MFA methods, exception requirements.

## Context to inspect
Conditional-access policies, device compliance, named locations, risk engines, session controls, exclusions, break-glass accounts, legacy protocols.

## Core knowledge
Zero Trust requires explicit verification, least privilege, and assumed breach. Contextual policy should be layered so unavailable or noisy signals do not create unsafe fail-open behavior.

## Procedure
1. Classify resources and users by risk.
2. Inventory available signals and their reliability.
3. Establish baseline MFA and legacy-auth blocks.
4. Add stronger device and authentication requirements for sensitive resources.
5. Define step-up and session controls.
6. Keep emergency exclusions minimal and monitored.
7. Stage policies in report-only or simulation mode where available.
8. Test false-positive and outage scenarios.
9. Monitor bypasses, exclusions, and policy coverage.
10. Reassess signals and risk thresholds using production evidence.

## Decision points
Block when confidence and impact justify it; challenge or restrict when signals are uncertain but suspicious.

## Common failure patterns
Large exclusion groups, trusting corporate IP alone, conflicting policies, untested device dependencies, and permanent bypasses created during incidents.

## Verification
Exercise normal, risky, unmanaged-device, privileged, and emergency scenarios and confirm both enforcement and logs.

## Expected output
Policy matrix, signal assumptions, exception controls, rollout plan, and verification evidence.

## Stop conditions
Escalate when critical access depends on unreliable signals or policy interactions cannot be predicted safely.