# Self-Service Model Access

## Purpose
Design and operate a controlled self-service layer through which engineering teams can discover and use approved foundation models without embedding provider-specific access patterns or unmanaged credentials in applications.

## When to use
Use when multiple teams consume LLM, embedding, vision, speech, or reranking models and need standardized onboarding, policy enforcement, or provider abstraction.

## Inputs
- Approved model/provider inventory
- Team identities and tenancy model
- Security and compliance requirements
- Quotas and budget constraints
- Supported SDK/API patterns

## Context to inspect
Inspect direct provider integrations, duplicated wrappers, API keys, client libraries, rate-limit incidents, model-specific assumptions, onboarding time, and existing IAM controls.

## Core knowledge
Self-service should reduce friction without eliminating intentional model choice. A platform access layer typically needs authentication, authorization, model catalog metadata, quotas, policy enforcement, usage telemetry, compatibility guarantees, and documented escape hatches.

## Procedure
1. Inventory current model consumers and access methods.
2. Define the stable platform contract separately from provider APIs.
3. Define model identifiers, capability metadata, and lifecycle states.
4. Integrate workload identity instead of distributing static secrets where possible.
5. Apply tenant-aware authorization and quotas.
6. Expose request metadata needed for observability and cost attribution.
7. Define provider/model-specific options that can safely pass through.
8. Define unsupported feature behavior explicitly.
9. Provide SDK examples and local-development paths.
10. Add conformance tests for supported models.
11. Add rollout and deprecation procedures.
12. Measure onboarding time and bypass behavior.

## Decision points
- Use a thin compatibility layer when portability matters; expose native provider APIs when advanced capabilities outweigh portability.
- Prefer workload identity over long-lived API keys.
- Keep model selection explicit unless an approved routing layer owns that decision.

## Common failure patterns
- Lowest-common-denominator APIs that block useful provider features.
- Hidden model substitution.
- Shared API keys with no tenant attribution.
- Missing rate-limit semantics.
- No migration path for model retirement.

## Verification
Verify authentication, authorization, quota isolation, provider error mapping, cost attribution, SDK behavior, and representative model capabilities. Successful API calls alone do not verify production readiness.

## Expected output
A stable, documented, self-service model access contract with policy, telemetry, examples, and lifecycle controls.

## Stop conditions
Stop when identity boundaries are unresolved, requested providers are unapproved, or the abstraction cannot preserve required model semantics.