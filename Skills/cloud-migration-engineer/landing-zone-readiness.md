# Landing Zone Readiness

## Purpose
Verify that the target cloud foundation can safely receive production workloads before migration waves begin.

## When to use
Use before pilots, before each major wave, and after significant landing-zone changes.

## Inputs
Target architecture, account/subscription/project hierarchy, IAM model, network design, policy controls, logging, security tooling, quotas, backup, DNS, key management, and platform runbooks.

## Preconditions
A target cloud and governance model must be selected. Required platform owners must be identifiable.

## Context to inspect
Inspect organizational hierarchy, identity federation, privileged access, network connectivity, egress, DNS, private endpoints, encryption, secrets, policy-as-code, audit logs, SIEM export, monitoring, backup, tagging, quotas, support plans, and break-glass access.

## Core knowledge
A landing zone is an operating foundation, not merely a network. Readiness includes security, governance, observability, financial controls, service quotas, support, automation, and operational ownership.

## Procedure
1. Translate workload requirements into landing-zone capabilities.
2. Validate environment and tenancy boundaries.
3. Test identity federation and least-privilege access.
4. Validate routing, DNS, firewall, egress, and hybrid connectivity.
5. Confirm centralized logs and audit trails reach approved destinations.
6. Validate encryption and key/secrets lifecycle.
7. Test policy guardrails against both allowed and prohibited configurations.
8. Confirm backup and restore mechanisms.
9. Validate tagging, budgets, ownership, and cost allocation.
10. Check quotas and regional capacity for planned waves.
11. Exercise deployment automation and rollback.
12. Test incident escalation and break-glass procedures.
13. Record gaps with severity and remediation owners.
14. Gate migration until critical readiness criteria pass.

## Decision points
Use centralized controls where consistency and auditability matter; delegate where teams require bounded autonomy. Prefer preventive guardrails for high-impact risks and detective controls where prevention would block legitimate delivery.

## Common failure patterns
Migrating before DNS is ready; missing egress controls; untested federation; no quota planning; audit logs without retention; backup configured but never restored; policy that blocks emergency recovery; no cost ownership.

## Verification
Run a representative deployment through the full path, including identity, network, logs, backup/restore, monitoring, and teardown. Capture evidence for every readiness criterion.

## Expected output
A pass/fail landing-zone readiness assessment, gap register, remediation owners, and explicit migration gate decision.

## Stop conditions
Stop when critical security controls, connectivity, identity, logging, backup, or capacity are not production-ready, or when required exceptions lack approval.