# Skill: Destination Binding Threat Model

## Purpose
Determine whether an authenticated tool can send credentials to a destination influenced by model, user, retrieved, or remote-server content.

## Trigger
New/changed outbound authenticated tool, URL/hostname parameter, redirect behavior, proxy path, or security advisory.

## Inputs
Tool schema, HTTP construction code, credential source/class, destination fields, redirect/proxy/DNS behavior, trust policy, representative tool calls.

## Preconditions
Identify the credential attachment point and the final network request code path.

## Required context
User intent, service-owned endpoint rules, deployment network boundaries, DNS/proxy behavior, and secret sensitivity.

## Allowed tools
Repository search, static analysis, unit/integration tests, DNS inspection against non-sensitive test hosts, dependency documentation.

## Constraints
Never use production secrets in tests. Never send real credentials to a test endpoint. Do not weaken TLS or certificate verification.

## Procedure
1. Trace each credential from acquisition to request attachment.
2. Trace each destination component from input to socket/request execution.
3. Label sources as trusted, policy-derived, user-controlled, model-controlled, retrieved, or remote-tool-controlled.
4. Record canonicalization: scheme, IDNA hostname, port, userinfo, path, redirects, proxy.
5. Identify whether authorization occurs before credential attachment.
6. Test bypass classes: lookalike suffix, base-domain-only match, trailing dot, uppercase, userinfo, IP literal, alternate port, redirect, private/special DNS result.
7. Require deterministic policy for any credential-bearing request.
8. Produce attack paths and mitigations with evidence.

## Decision points
- If destination is fixed in trusted code, verify it cannot be overridden.
- If destination is dynamic but service-bounded, require explicit allowlist/binding.
- If arbitrary destinations are a product requirement, do not attach service credentials automatically; use separate per-origin authorization.

## Expected output
Trust-boundary map, credential-to-destination matrix, attack fixtures, required controls, residual risks.

## Metrics
Credential-bearing paths covered; destination-control sources identified; adversarial fixtures blocked before credential attachment.

## Verification
An independent reviewer confirms every network path that can carry the credential is represented.

## Failure handling
If destination behavior cannot be determined, block release of the authenticated path and escalate for code/runtime tracing.

## Stop conditions
Complete when all credential-bearing paths have a deterministic destination policy and adversarial tests, or when unresolved paths are explicitly blocked.