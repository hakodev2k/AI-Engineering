# KMS and Encryption Design

## Purpose
Design AWS encryption and key-management controls that balance security, operability, performance, and recovery.

## When to use
Use for encrypted storage, cross-account data access, regulated workloads, custom keys, rotation, or decryption failures.

## Inputs
Data classification, services, account boundaries, key ownership, retention, latency/cost constraints, compliance obligations.

## Context to inspect
KMS keys, aliases, key policies, grants, IAM policies, encryption contexts, CloudTrail, service integrations, backup/restore requirements.

## Core knowledge
KMS authorization combines key policy, IAM, grants, and service context. Key deletion is destructive. Customer-managed keys improve control but add policy, quota, and operational overhead.

## Procedure
1. Identify data requiring encryption and trust boundaries.
2. Decide AWS-owned, AWS-managed, or customer-managed key model.
3. Define key ownership and administrators separately from users.
4. Scope key policy and grants to expected principals/services.
5. Use encryption context conditions when valuable.
6. Plan rotation, replication, backup dependencies, and deletion safeguards.
7. Validate cross-account and service-linked use cases.
8. Monitor KMS errors, throttling, and unexpected decrypt events.

## Decision points
Choose customer-managed keys when independent policy, audit, or lifecycle control is required. Prefer service defaults when added control provides no material risk reduction.

## Common failure patterns
Overly broad key policies, accidental lockout, deleting keys before data retirement, cross-account assumptions that ignore key policy, and excessive KMS API usage.

## Verification
Test encrypt/decrypt, restore paths, denied principals, cross-account access, and audit visibility.

## Expected output
Key hierarchy, policies, lifecycle rules, and recovery evidence.

## Stop conditions
Escalate before destructive key deletion, unresolved regulatory ownership, or any change that could render retained data unreadable.