# Network Access Control

## Purpose
Control device and user admission to networks using identity, posture, authorization, and containment policies.

## When to use
Use for 802.1X/NAC deployment, guest/BYOD access, device onboarding, or unauthorized-device investigations.

## Inputs
Identity sources, device inventory, switch/WLAN capabilities, certificate strategy, posture requirements, exception needs.

## Context to inspect
RADIUS, supplicants, certificates, VLAN/role assignment, MAB fallbacks, guest networks, enforcement logs.

## Core knowledge
802.1X, EAP methods, RADIUS, certificate authentication, posture assessment, dynamic authorization, fallback risks.

## Procedure
1. Classify device and user populations.
2. Choose authentication methods per population.
3. Integrate authoritative identity and certificate sources.
4. Define authorization roles and restricted states.
5. Pilot in monitor mode.
6. Remediate incompatible endpoints.
7. Enable enforcement progressively.
8. Monitor authentication failures and bypass use.
9. Recertify exceptions.

## Decision points
Prefer certificate-based authentication for managed devices. Use MAB only as constrained fallback for devices that cannot perform stronger authentication.

## Common failure patterns
Permanent bypass lists, shared credentials, weak EAP methods, untested certificate renewal, no guest isolation, fail-open without risk approval.

## Verification
Test managed, unmanaged, revoked, guest, and failed-posture cases; verify assigned access and logs.

## Expected output
NAC policy, onboarding paths, exception process, test evidence, monitoring.

## Stop conditions
Escalate if identity sources are unreliable, endpoint compatibility is unknown at scale, or enforcement can strand critical operations.