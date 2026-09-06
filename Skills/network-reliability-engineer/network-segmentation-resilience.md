# Network Segmentation Resilience

## Purpose
Design segmentation that limits security blast radius without creating brittle connectivity, unmanageable policy sprawl, or hidden reliability dependencies.

## When to use
Use for zero-trust initiatives, environment isolation, tenant segmentation, compliance boundaries, or redesign of flat networks.

## Inputs
Traffic flows, trust zones, identity model, firewall policy, routing topology, service dependencies, incident history, and recovery requirements.

## Context to inspect
Inspect east-west dependencies, shared services, DNS, identity, management access, health checks, failover paths, and emergency access requirements.

## Core knowledge
Segmentation improves containment but every enforcement boundary adds operational failure modes. Reliable segmentation requires explicit dependency discovery, least privilege, observability, and tested recovery paths.

## Procedure
1. Classify assets and trust boundaries by risk.
2. Map required flows across proposed segments.
3. Identify shared infrastructure that crosses boundaries.
4. Choose enforcement points with clear ownership.
5. Define least-privilege policy and default-deny behavior where appropriate.
6. Preserve management, monitoring, DNS, identity, and failover dependencies.
7. Roll out incrementally using observed-flow evidence.
8. Test allowed, denied, failover, and emergency-access cases.
9. Monitor policy-deny events after rollout.
10. Periodically remove stale exceptions.

## Decision points
Prefer coarse segmentation when operational maturity is low; increase granularity only where risk justifies policy complexity. Use identity-aware controls when network identity alone is insufficient and the control plane is reliable.

## Common failure patterns
Microsegmentation without dependency discovery, broad permanent exceptions, blocked health checks, inaccessible management planes, asymmetric stateful paths, and policy ownership gaps.

## Verification
Validate authorized and unauthorized flows, monitoring continuity, failover behavior, and blast-radius containment through controlled tests.

## Expected output
A segmentation design or change that improves containment while preserving required service reliability.

## Stop conditions
Escalate when required dependencies are unknown, policy changes could lock out operators, or security approval is mandatory.