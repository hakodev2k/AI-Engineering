# Mesh Security Threat Modeling

## Purpose
Identify mesh-specific attack paths and choose controls proportional to trust boundaries and asset sensitivity.

## When to use
Use for architecture review, new trust federation, gateway exposure or security assessment.

## Inputs
Data flows, identities, assets, trust domains, administrative roles, external interfaces and threat assumptions.

## Context to inspect
CA/control-plane privileges, proxy admin endpoints, policy APIs, gateways, secrets, telemetry and supply-chain sources.

## Core knowledge
A mesh can reduce workload impersonation while introducing privileged control-plane and proxy surfaces. Compromise of policy distribution or CA infrastructure can have fleet-wide impact.

## Procedure
1. Identify assets and security objectives.
2. Draw trust boundaries and privileged components.
3. Enumerate spoofing, tampering, disclosure, denial and privilege-escalation paths.
4. Analyze CA and control-plane compromise.
5. Review proxy admin/debug exposure.
6. Review ingress/egress bypass paths.
7. Assess configuration supply chain and RBAC.
8. Prioritize risks by likelihood and impact.
9. Define preventive, detective and recovery controls.
10. Validate high-risk scenarios with safe tests.

## Decision points
Isolate control planes or trust domains when blast-radius reduction outweighs operational complexity. Add L7 inspection only when its security value exceeds privacy/performance cost.

## Common failure patterns
Treating mTLS as complete zero trust, exposed admin ports, excessive config privileges, unmonitored policy changes and global CA without recovery design.

## Verification
Trace each material threat to a tested control or accepted risk owner.

## Expected output
A prioritized threat model with mitigations and residual risks.

## Stop conditions
Escalate unresolved critical risks, unclear trust ownership or controls requiring security approval.