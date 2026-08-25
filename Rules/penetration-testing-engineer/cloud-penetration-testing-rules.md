# Cloud Penetration Testing Rules

## Purpose
Test cloud control planes and workloads while respecting tenant, provider, and account boundaries.

## Scope
Covers cloud identities, IAM, storage, compute, metadata services, serverless resources, managed services, networking, and control-plane APIs.

## MUST
- MUST identify authorized accounts, subscriptions, projects, regions, tenants, and provider restrictions before testing.
- MUST map identity paths, trust policies, public exposure, data stores, and privilege-escalation opportunities using least-impact validation.
- MUST distinguish provider-managed infrastructure from customer-controlled resources.
- MUST record all temporary resources, credentials, role assumptions, and policy changes created for testing and remove them afterward.
- MUST protect cloud access tokens and configuration artifacts as secrets.

## MUST NOT
- MUST NOT test provider infrastructure or neighboring tenants outside authorization.
- MUST NOT create costly, persistent, or externally exposed resources without explicit need and approval.
- MUST NOT change production IAM, network, logging, or security policy merely to simplify testing.
- MUST NOT disable audit logging.

## SHOULD
- SHOULD validate attack paths from realistic initial principals rather than only highly privileged accounts.
- SHOULD consider cost, quota, and regional blast radius when selecting techniques.

## Exceptions
Material policy changes, destructive control-plane actions, or high-cost resource creation require explicit human approval and rollback plans.

## Verification
Review cloud audit logs, assumed-role history, resource inventories, policy diffs, billing-impact checks, evidence captures, and cleanup confirmation.