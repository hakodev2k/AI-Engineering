# AWS Security Baseline

## Purpose
Establish repeatable preventive, detective, and responsive security controls across AWS accounts.

## When to use
Use for landing zones, security reviews, new accounts, compliance preparation, or remediation programs.

## Inputs
Risk profile, compliance requirements, account inventory, data classes, incident model, security tooling.

## Context to inspect
CloudTrail, Config, GuardDuty, Security Hub, IAM, KMS, S3 public access, VPC flow logs, root-user controls, patching, backup policies.

## Core knowledge
Security requires layered controls: identity, network, encryption, logging, configuration, vulnerability management, and response. Centralized telemetry must be protected from workload administrators.

## Procedure
1. Define mandatory controls by account type.
2. Protect root credentials and require MFA.
3. Centralize organization-wide CloudTrail and Config.
4. Enable GuardDuty and Security Hub with delegated administration.
5. Enforce public-access protections and encryption defaults where appropriate.
6. Define minimum IAM and key-management standards.
7. Configure vulnerability and patch visibility.
8. Protect audit/log accounts from mutation.
9. Implement automated findings routing and ownership.
10. Test incident access and evidence preservation.

## Decision points
Use preventive controls when failure is unacceptable; use detective controls where flexibility is needed. Avoid blanket encryption or deny policies without compatibility validation.

## Common failure patterns
Security services enabled but unowned, mutable logs, root keys, regional blind spots, alert floods, and exceptions without expiry.

## Verification
Confirm coverage across all regions/accounts, test representative findings, validate log integrity, and review unresolved exceptions.

## Expected output
Baseline controls, exception process, ownership map, and evidence of coverage.

## Stop conditions
Escalate when mandated controls conflict with production availability or regulated workloads lack clear control ownership.