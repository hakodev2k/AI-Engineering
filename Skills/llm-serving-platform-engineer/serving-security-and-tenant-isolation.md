# Serving Security and Tenant Isolation

## Purpose
Protect inference endpoints, model assets, tenant data, caches, and accelerator capacity in shared serving environments.

## When to use
Use for new tenancy, public endpoints, security reviews, cache sharing, or privileged model access.

## Inputs
Threat model, tenant model, identity system, data classification, model permissions, network topology, compliance requirements.

## Context to inspect
Gateway auth, service identities, network policy, secrets, model store ACLs, logs, prefix/KV caches, quotas, runtime sandboxing, and admin APIs.

## Core knowledge
Authorization must be enforced server-side for model access and administrative operations. Prompts/outputs are sensitive data. Shared caches and multiplexed models can create cross-tenant leakage risks. Resource exhaustion is also a security boundary.

## Procedure
1. Identify assets, actors, trust boundaries, and abuse cases. 2. Authenticate callers and services strongly. 3. Authorize model/version and operation access. 4. Apply tenant quotas and request limits. 5. Encrypt network/storage paths as required. 6. Scope secrets and model-store permissions minimally. 7. Prevent sensitive prompt/output logging by default. 8. Partition or validate cache sharing. 9. Harden admin/debug endpoints. 10. Test unauthorized access, tenant confusion, oversized requests, and exhaustion. 11. Audit security-relevant actions.

## Decision points
Prefer physical/dedicated isolation for high-risk tenants when logical controls cannot satisfy requirements. Share prefix caches only with explicit safe scoping.

## Common failure patterns
Authentication without authorization, tenant ID accepted from untrusted payloads, shared cache leakage, secrets in logs, public metrics/admin ports, and unlimited expensive requests.

## Verification
Run authorization, isolation, abuse, and logging tests; review permissions and audit evidence.

## Expected output
A threat-informed serving security design with tested tenant boundaries and resource controls.

## Stop conditions
Stop when data classification, trust boundaries, or required approvals are unresolved.