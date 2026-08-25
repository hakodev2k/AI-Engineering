# Messaging Security and Access Control

## Purpose
Secure broker access, message flows, credentials, and administrative operations using least privilege and auditable controls.

## When to use
Use when onboarding producers/consumers, reviewing ACLs, configuring TLS, rotating credentials, or handling sensitive event streams.

## Inputs
- Identity sources
- Data classification
- Producer/consumer ownership
- Network architecture
- Broker authentication and authorization capabilities

## Context to inspect
Inspect authentication mechanisms, ACLs, service accounts, certificates, secret storage, network policies, audit logs, encryption settings, and admin privileges.

## Core knowledge
Senior engineers should understand TLS/mTLS, SASL/OAuth, broker ACL models, topic/queue permissions, credential rotation, certificate lifecycle, network segmentation, encryption at rest, and privileged administration.

## Procedure
1. Classify data and identify authorized producers and consumers.
2. Use workload identities instead of shared human credentials.
3. Enforce encrypted transport and validate certificates.
4. Grant destination-level permissions using least privilege.
5. Restrict administrative operations separately from data-plane access.
6. Store and rotate secrets through approved secret-management systems.
7. Segment broker endpoints and management interfaces at the network layer.
8. Enable authentication, authorization, and configuration audit logs.
9. Test denied as well as allowed access paths.

## Decision points
Prefer short-lived federated credentials over long-lived static secrets. Use mTLS where strong workload identity and certificate operations are mature; use OAuth/SASL when centralized token identity is better supported.

## Common failure patterns
- Shared producer credentials
- Wildcard ACLs for convenience
- Management ports exposed broadly
- TLS without certificate validation
- Credential rotation that breaks long-lived clients

## Verification
Attempt authorized and unauthorized publishes/consumes, verify audit events, rotate credentials in a test window, and confirm encryption and network restrictions.

## Expected output
A least-privilege access model with identity, encryption, rotation, auditing, and verified negative tests.

## Stop conditions
Stop when data classification is unknown, identity ownership is ambiguous, or required access cannot be expressed without broad privileges.