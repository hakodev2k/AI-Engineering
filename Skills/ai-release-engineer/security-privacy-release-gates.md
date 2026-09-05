# Security and Privacy Release Gates

## Purpose
Prevent AI releases from weakening authentication, authorization, tenant isolation, sensitive-data handling, secrets protection, or provider privacy commitments.

## When to use
Use for any release touching user data, retrieval, memory, external providers, tools, credentials, logging, or security controls.

## Inputs
Threat model, data classification, access-control design, provider data policy, security tests, privacy requirements, release diff.

## Preconditions
Security and privacy owners are identifiable and relevant controls have measurable acceptance criteria.

## Context to inspect
Prompt/context logging, RAG ACLs, tool scopes, secrets, model-provider retention, data residency, caches, memory stores, audit trails, and deletion paths.

## Core knowledge
AI systems create additional disclosure surfaces through prompts, embeddings, traces, provider requests, generated outputs, and autonomous tools. A release can preserve functionality while silently broadening data exposure.

## Procedure
1. Identify new or changed data flows.
2. Revalidate authentication and authorization boundaries.
3. Test cross-tenant and privilege-escalation scenarios.
4. Confirm sensitive fields are minimized and redacted where required.
5. Validate provider retention and residency assumptions.
6. Check secrets cannot enter prompts, logs, or generated output through normal paths.
7. Review tool credentials for least privilege.
8. Test deletion and revocation propagation.
9. Record security/privacy approvals and exceptions.
10. Block rollout when critical controls cannot be verified.

## Decision points
Fail closed when authorization is uncertain. Require specialist approval when data classification, regulation, or threat level exceeds standard policy.

## Common failure patterns
Relying on model refusal for access control, logging full prompts by default, stale RAG ACLs, overprivileged tool credentials, and assuming provider defaults satisfy policy.

## Verification
Run authorization, cross-tenant, sensitive-data, and credential-boundary tests on the candidate environment and confirm audit evidence.

## Expected output
A release gate decision with tested controls, residual risks, approvals, and blockers.

## Stop conditions
Stop release on confirmed unauthorized access, sensitive-data leakage, unresolved residency issues, or unapproved material privacy risk.