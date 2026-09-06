# Security and Isolation Rules

## Purpose
Protect inference services, model artifacts, credentials, tenants, and sensitive request data.

## Scope
Authentication, authorization, network boundaries, secrets, artifact access, tenant isolation, request data, and administrative operations.

## MUST
- Every externally or internally shared inference endpoint MUST authenticate callers and enforce explicit authorization where required.
- Service identities MUST receive least-privilege access to models, stores, queues, and infrastructure.
- Tenant-sensitive state, caches, and request metadata MUST be isolated across authorization boundaries.
- Model artifacts and serving images MUST come from trusted, integrity-checked sources.
- High-risk access changes and security-policy reductions MUST require human approval.

## MUST NOT
- MUST NOT embed credentials in source code, model artifacts, images, or logs.
- MUST NOT expose raw prompts, responses, embeddings, or intermediate state beyond authorized processing and retention boundaries.
- MUST NOT bypass security controls merely to restore throughput or reduce latency.

## SHOULD
- Prefer workload identity and short-lived credentials.
- Apply network and artifact-access restrictions proportionate to model and data sensitivity.

## Exceptions
Exceptions require threat analysis, compensating controls, duration, owner, verification, and approval.

## Verification
Inspect IAM policies, credential configuration, artifact provenance, isolation tests, network policy, and audit logs.