# Multi-Tenant Policy Isolation Rules

## Purpose
Prevent policy evaluation, policy data, exceptions, and administrative operations from crossing tenant isolation boundaries.

## Scope
Applies to multi-tenant decision services, tenant-specific policy, shared policy engines, caches, bundles, data stores, logs, and operator tooling.

## MUST
- Tenant identity MUST be derived from a trusted context and included wherever it affects policy selection, data lookup, caching, or authorization.
- Shared evaluators MUST prevent one tenant's policy data, decisions, exceptions, or administrative configuration from influencing another tenant unless explicitly designed and authorized.
- Cache keys and derived decision artifacts MUST include all tenant-relevant isolation dimensions.
- Tenant-specific policy overrides MUST have documented precedence relative to shared baseline controls.
- Cross-tenant administrative actions MUST require explicit authorization and audit evidence.
- Isolation behavior MUST be tested with negative cases using distinct tenant identities and overlapping resource identifiers.

## MUST NOT
- Caller-provided tenant identifiers MUST NOT be trusted without binding them to authenticated context.
- Global exceptions MUST NOT be used to solve a tenant-local issue unless the broader risk is intentionally approved.
- Tenant-specific policy MUST NOT weaken mandatory shared security boundaries unless the governance model explicitly permits and approves it.
- Logs or diagnostic outputs MUST NOT expose another tenant's sensitive decision context.

## SHOULD
- Tenant-specific policy and data SHOULD be partitioned so accidental cross-tenant retrieval is structurally difficult.
- Shared baseline controls SHOULD be centrally maintained while preserving explicit tenant extension points where required.

## Exceptions
Any intentional cross-tenant behavior requires documented use case, data flows, authorization model, threat analysis, tests, monitoring, and accountable approval.

## Verification
Run tenant-isolation tests, cache-collision tests, policy-selection tests, exception-scope tests, permission reviews, and log inspection. Attempt cross-tenant queries and administrative actions to prove they are denied outside explicitly authorized workflows.