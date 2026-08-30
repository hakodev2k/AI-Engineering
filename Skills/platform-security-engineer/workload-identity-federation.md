# Workload Identity Federation

## Purpose
Replace static platform credentials with scoped, short-lived workload identities that can be authenticated and authorized across CI/CD, clusters, clouds, and shared platform services.

## When to use
Use when workloads currently depend on API keys, service-account secrets, cloud access keys, or long-lived tokens; when onboarding a new runtime; or when standardizing machine-to-machine authentication.

## Inputs
Identity provider capabilities, workload runtime, service mesh or cluster identity, cloud IAM, token claims, audience requirements, trust policies, and service authorization rules.

## Context to inspect
Inspect token issuers, signing keys, trust anchors, claim mapping, audience restrictions, credential injection paths, rotation behavior, workload scheduling identity, and fallback credentials.

## Core knowledge
Federation reduces secret inventory but expands trust-policy complexity. Security depends on issuer integrity, constrained audiences, subject binding, short lifetimes, narrow trust relationships, and authorization at the target resource.

## Procedure
1. Inventory long-lived machine credentials and their consumers.
2. Identify trustworthy workload identity signals in each runtime.
3. Choose federation paths between workload issuer and target service or cloud.
4. Define subject, audience, tenant, environment, and service constraints.
5. Configure target-side trust policies with minimum scope.
6. Remove unnecessary secret distribution from deployment workflows.
7. Set short token lifetimes and automated refresh behavior.
8. Ensure tokens cannot be replayed across unintended services or environments.
9. Add logging for token issuance, exchange, denial, and privileged use.
10. Test normal, expired, wrong-audience, wrong-subject, and cross-tenant cases.
11. Migrate incrementally with rollback and credential revocation plans.
12. Remove legacy static credentials after verified cutover.

## Decision points
Prefer native workload identity when the runtime and target support strong federation. Use a broker only when it materially simplifies heterogeneous trust without becoming an unaudited super-credential service.

## Common failure patterns
Wildcard subject trust, broad audiences, dual-running static secrets indefinitely, identity reuse across environments, and accepting unverified workload metadata.

## Verification
Prove that workloads authenticate without stored static credentials, invalid claims are rejected, access is least privilege, expired credentials stop working, and audit logs identify the calling workload.

## Expected output
A federated workload identity design, migration plan, trust policies, negative tests, and decommissioned static credentials.

## Stop conditions
Stop when the workload issuer cannot be trusted, claims cannot uniquely bind workload identity, or migration would remove the only recoverable production access path without an approved fallback.