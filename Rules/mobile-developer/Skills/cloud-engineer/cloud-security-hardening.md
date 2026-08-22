# Cloud Security Hardening

## Purpose
Reduce cloud attack surface through secure configuration, segmentation, identity controls, encryption, and continuous posture management.

## When to use
Use for production readiness, security reviews, new services, or remediation of posture findings.

## Inputs
Architecture, resource inventory, security baseline, threat model, compliance obligations.

## Context to inspect
IAM, public exposure, firewall rules, encryption, logging, secrets, metadata services, storage policies, security findings.

## Core knowledge
Cloud security is shared responsibility. Managed services reduce operational burden but unsafe identities, configuration, data exposure, and supply chain remain customer risks.

## Procedure
1. Inventory internet-reachable and sensitive resources.
2. Apply least privilege to identities.
3. Remove unnecessary public access.
4. Enforce encryption and managed key policies appropriate to risk.
5. Harden compute and metadata access.
6. Centralize security logs.
7. Enable posture and vulnerability scanning.
8. Codify mandatory policies.
9. Remediate critical findings by exploitability and impact.
10. Continuously detect drift.

## Decision points
Prefer managed security controls where they provide equivalent assurance and lower operational risk. Add customer-managed keys only when requirements justify lifecycle complexity.

## Common failure patterns
Security groups open globally, unused admin identities, public storage, disabled audit logs, secrets in configuration, and alert overload without ownership.

## Verification
Validate controls from attacker-relevant paths and confirm policy violations are detected.

## Expected output
A hardened, monitored cloud environment with documented exceptions.

## Stop conditions
Escalate accepted high-risk exposure or controls that require business/security approval.