# Robotics Security

## Purpose
Reduce cybersecurity risk across robot software, middleware, networks, devices, update paths, credentials, and fleet operations without compromising safety or real-time behavior.

## When to use
Use when exposing remote control, adding network services, reviewing ROS/DDS deployments, designing updates, integrating third-party devices, or preparing production deployment.

## Inputs
- Network and trust architecture
- Robot services and ports
- Identity and credential model
- Update mechanism
- Device/firmware inventory
- Threat model and operational environment

## Preconditions
Safety and operational recovery requirements must be considered alongside security controls; a security mechanism that prevents safe shutdown or recovery is unacceptable.

## Context to inspect
Inspect network interfaces, DDS security configuration, remote shells, exposed APIs, credentials, certificates, firewall rules, update signing, package provenance, OS hardening, device permissions, and physical debug interfaces.

## Core knowledge
Understand least privilege, network segmentation, mutual authentication, encryption, secure boot/update chains, key lifecycle, supply-chain risk, service hardening, auditability, physical access, and availability-oriented threat modeling.

## Procedure
1. Identify assets, trust boundaries, remote entry points, and safety-impacting commands.
2. Inventory listening services and default credentials.
3. Remove unnecessary services and debug interfaces from production.
4. Segment robot control networks from untrusted networks where practical.
5. Require authenticated authorization for remote commands and administration.
6. Protect secrets using platform-appropriate secure storage and rotation.
7. Verify artifact provenance and signed update paths where supported.
8. Apply least privilege to processes, devices, and filesystem access.
9. Define behavior during certificate expiry, identity-service loss, and network isolation.
10. Log security-relevant actions without leaking secrets.
11. Test unauthorized access, replay, malformed traffic, and update rollback scenarios.
12. Track dependency and firmware vulnerabilities with operational risk assessment.

## Decision points
Use encryption/authentication where threat model and platform support justify it, but account for CPU/latency budgets. Prefer network isolation when constrained legacy devices cannot be hardened. Security updates require the same staged validation as functional releases.

## Common failure patterns
- Default credentials left enabled
- Robot-wide shared secrets with no rotation
- Exposing DDS discovery/control traffic to broad networks
- Unsigned or unverified update artifacts
- Running device interfaces as root without need
- Security controls that block emergency recovery

## Verification
Scan exposed services, verify authorization boundaries, test certificate/key rotation, inspect update provenance, validate least-privilege permissions, and exercise offline/degraded recovery.

## Expected output
A robotics security design with threat boundaries, hardened services, identity controls, secure update path, audit signals, and recovery considerations.

## Stop conditions
Stop and escalate when a vulnerability permits unauthorized hazardous motion, required credentials cannot be protected, a production update would disable safety recovery, or remediation requires changes to certified/security-controlled infrastructure.