# Dependency and Provider Lifecycle

## Purpose
Manage the lifecycle of model providers, SDKs, gateways, vector databases, evaluators, runtimes, and other AI platform dependencies so upgrades and retirements do not create hidden production risk.

## When to use
Use when a provider changes API behavior, an SDK reaches end of support, a model family is deprecated, or platform dependencies require upgrade or replacement.

## Inputs
- Dependency inventory
- Support and deprecation notices
- Security advisories
- Compatibility matrix
- Application dependency graph
- Evaluation and performance baselines

## Context to inspect
Inspect lockfiles, runtime images, SDK versions, provider endpoints, model aliases, feature usage, application consumers, release history, security scans, and contractual support windows.

## Core knowledge
AI dependencies change behavior as well as interfaces. A model or provider migration can preserve HTTP compatibility while changing quality, latency, safety, tokenization, or cost. Lifecycle management must therefore pair software compatibility checks with AI evaluations and production canaries.

## Procedure
1. Maintain an inventory with owners and support status.
2. Identify critical and transitive dependencies.
3. Subscribe to provider deprecation and security notices.
4. Classify changes as security, compatibility, behavior, performance, or cost risk.
5. Build a replacement or upgrade candidate matrix.
6. Run contract, evaluation, latency, and cost comparisons.
7. Identify applications relying on provider-specific behavior.
8. Define migration sequence and rollback path.
9. Canary the change with representative workloads.
10. Communicate deadlines and migration guidance.
11. Remove retired credentials, endpoints, and compatibility code.
12. Update the inventory and evidence after completion.

## Decision points
Patch immediately when security exposure dominates; otherwise stage changes according to risk. Preserve provider-specific features when they deliver material value rather than forcing portability for its own sake.

## Common failure patterns
Blind SDK auto-upgrades, waiting until provider shutdown dates, no consumer inventory, API-only tests for model migrations, stale compatibility shims, and retained credentials after provider retirement.

## Verification
Verify dependency scans, consumer migration, contract tests, AI evaluations, canary metrics, credential cleanup, and absence of traffic to retired endpoints.

## Expected output
A controlled dependency lifecycle with inventory, risk classification, tested migration, rollback plan, and retirement evidence.

## Stop conditions
Stop when consumers cannot be identified, replacement quality is materially worse without business approval, or an urgent security issue requires escalation outside normal migration flow.