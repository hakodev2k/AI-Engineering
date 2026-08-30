# Policy as Code Governance

## Purpose
Design, implement, and govern machine-enforced security policies for platform resources so critical requirements are consistent, reviewable, testable, and auditable.

## When to use
Use when standardizing controls across clusters, cloud accounts, CI/CD, infrastructure templates, developer self-service, or admission paths.

## Inputs
Security requirements, policy engine capabilities, resource schemas, exception process, deployment workflow, ownership model, and existing violations.

## Context to inspect
Inspect enforcement points, policy repositories, policy bundles, rollout mechanisms, exception metadata, policy decision logs, and failure behavior when policy services are unavailable.

## Core knowledge
Policy as code is effective when policy intent is explicit, enforcement is close to the protected boundary, tests cover both allow and deny cases, and exceptions expire. Policies that are too broad or noisy are bypassed.

## Procedure
1. Translate security requirements into precise enforceable statements.
2. Identify the correct enforcement boundary for each policy.
3. Separate mandatory controls from advisory guidance.
4. Write policies with clear resource scope and rationale.
5. Add positive, negative, and edge-case tests.
6. Test against representative existing resources to estimate impact.
7. Roll out in audit mode when safe to discover false positives.
8. Define exception ownership, justification, scope, and expiration.
9. Move mature controls to blocking enforcement.
10. Version policy and decision logic.
11. Monitor denials, bypasses, exceptions, and policy-service health.
12. Periodically remove obsolete rules and tighten broad exceptions.

## Decision points
Use preventive enforcement for high-confidence, high-impact controls. Use detective controls when blocking could create disproportionate availability risk or policy context is incomplete.

## Common failure patterns
Unversioned policies, permanent exceptions, no test suite, enforcement only in CI, fail-open behavior without visibility, and rules that encode tool-specific assumptions instead of security intent.

## Verification
Verify policy tests pass, unauthorized configurations are blocked at the intended boundary, allowed configurations remain deployable, and exceptions are discoverable and time-bounded.

## Expected output
Versioned policies, tests, rollout evidence, exception governance, and operational monitoring.

## Stop conditions
Stop when a policy cannot distinguish safe from unsafe states reliably, blocking would cause unquantified production impact, or required exceptions have no accountable owner.