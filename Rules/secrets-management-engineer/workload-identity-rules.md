# Workload Identity Rules

## Purpose
Reduce static credentials by binding secret access to authenticated workloads.

## Scope
Applications, services, containers, functions, CI jobs, agents, and infrastructure automation.

## MUST
- Workloads MUST use a unique, attributable identity when the platform supports it.
- Identity trust MUST be bound to verifiable workload attributes and the minimum required audience, environment, and privilege.
- Federated or dynamically issued credentials MUST have bounded lifetime and validation of issuer and audience.
- Identity bootstrap mechanisms MUST be protected against credential substitution and replay.

## MUST NOT
- Multiple unrelated workloads MUST NOT share one static credential for convenience.
- Long-lived bootstrap credentials MUST NOT be embedded in images or repositories.
- A workload identity MUST NOT be trusted solely because it originates from an internal network.

## SHOULD
- Prefer platform-native workload identity federation over stored cloud access keys.
- Credentials SHOULD expire faster as privilege and blast radius increase.

## Exceptions
Static credentials require documented platform limitation, rotation controls, monitoring, owner, expiry, and migration plan.

## Verification
Inspect identity-provider trust policies, token claims, credential lifetimes, deployment manifests, secret scans, and access logs. Test that a workload outside the intended trust context cannot obtain credentials.