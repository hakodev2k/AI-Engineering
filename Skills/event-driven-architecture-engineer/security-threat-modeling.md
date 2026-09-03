# Event Security Threat Modeling

## Purpose
Identify and mitigate threats introduced by asynchronous messaging and event infrastructure.

## When to use
Use for new event domains, broker exposure, cross-trust integrations, or security reviews.

## Inputs
Architecture, trust boundaries, identities, topics/queues, payload classifications, broker controls.

## Context to inspect
Authentication, authorization, encryption, network paths, schema validation, tenancy, retention, audit logs, and administrative access.

## Core knowledge
Threats include unauthorized publish/consume, event forgery, replay abuse, cross-tenant leakage, sensitive retention, schema attacks, poisoned consumers, and excessive broker privileges.

## Procedure
1. Draw producers, brokers, consumers, stores, and trust boundaries.
2. Classify event data and business impact.
3. Identify identities for workloads and operators.
4. Apply least-privilege publish/subscribe permissions.
5. Validate schemas and size limits before processing.
6. Protect transport and stored messages appropriately.
7. Address replay and duplicate abuse using identity/version/business checks.
8. Restrict and audit administrative/replay capabilities.
9. Define retention/deletion consistent with policy.
10. Test unauthorized and malformed-message scenarios.

## Decision points
Use message signing when trust crosses infrastructure boundaries or provenance must survive intermediaries; otherwise authenticated broker transport may suffice. Minimize sensitive payloads rather than relying only on encryption.

## Common failure patterns
Wildcard permissions, shared credentials, secrets in events, trusting producer input, unbounded message size, unaudited replay, and tenant IDs without authorization checks.

## Verification
Security tests demonstrate denied unauthorized publish/consume, schema rejection, tenant isolation, credential rotation, and auditable privileged actions.

## Expected output
Threat model, mitigations, access matrix, and verification evidence.

## Stop conditions
Stop when data classification or trust boundaries are unknown, or security changes require formal approval.