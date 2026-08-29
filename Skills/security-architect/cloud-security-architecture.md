# Cloud Security Architecture

## Purpose
Design cloud environments so identity, network, data, workload, and management controls remain consistent with organizational risk requirements.

## When to use
Use for cloud adoption, landing zones, workload migrations, multi-account or multi-subscription design, and cloud-native platforms.

## Inputs
Cloud provider architecture, tenancy model, account hierarchy, identity design, data classification, workload types, compliance obligations.

## Preconditions
Target cloud services and operating model are sufficiently defined.

## Context to inspect
Organization hierarchy, IAM, network design, encryption, logging, key management, workload identities, policy-as-code, CI/CD, and shared services.

## Core knowledge
Cloud security depends heavily on control-plane identity, account isolation, secure defaults, policy automation, and shared-responsibility boundaries. Misconfiguration is often systemic rather than local.

## Procedure
1. Define account or subscription boundaries by risk and ownership.
2. Establish federated identity and privileged administration controls.
3. Create network and private-access patterns.
4. Define data protection and key-management standards.
5. Secure workload identity and secret distribution.
6. Enforce baseline configuration through policy-as-code.
7. Centralize security telemetry without blocking local operations.
8. Define exception, remediation, and drift-management workflows.
9. Validate backup, recovery, and incident access patterns.

## Decision points
Choose centralized guardrails for high-risk controls and delegated implementation where teams need flexibility. Prefer managed services when they reduce operational risk without creating unacceptable dependency or lock-in.

## Common failure patterns
One large shared account, local long-lived credentials, public-by-default services, inconsistent logging, unmanaged exceptions, and controls that exist only in documentation.

## Verification
Validate representative workloads against the baseline, negative access cases, logging, key use, network exposure, and policy enforcement.

## Expected output
A cloud security reference architecture with guardrails, shared services, ownership, and exception handling.

## Stop conditions
Stop when cloud ownership is undefined, regulatory constraints are unresolved, or the proposed model cannot produce auditable enforcement.