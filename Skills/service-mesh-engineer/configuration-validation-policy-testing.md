# Configuration Validation and Policy Testing

## Purpose
Prevent invalid or dangerous mesh configuration from reaching production.

## When to use
Use when building CI checks, reviewing routing/security policy or introducing new mesh APIs.

## Inputs
Declarative mesh config, schemas, organizational policy, test environments and known traffic contracts.

## Context to inspect
CRD versions, admission controls, generated proxy config, GitOps flow, policy engines and environment overlays.

## Core knowledge
Schema validity is weaker than semantic safety. Two individually valid resources can conflict. Generated data-plane configuration is the effective behavior and should be tested where feasible.

## Procedure
1. Validate syntax and schema offline.
2. Reject deprecated or unsupported APIs.
3. Apply organization invariants such as no wildcard privileged principals.
4. Detect conflicting hosts, routes and destination subsets.
5. Render or inspect generated proxy configuration in a test environment.
6. Run positive and negative traffic tests.
7. Test configuration deletion and rollback.
8. Gate promotion on policy and integration results.
9. Track exceptions with owner and expiry.

## Decision points
Use admission rejection for high-confidence safety invariants; use warnings for context-dependent risks to avoid blocking legitimate work.

## Common failure patterns
Lint-only validation, testing only allow cases, environment-specific overlays bypassing checks, stale CRDs and permanent policy exceptions.

## Verification
Demonstrate that known-bad fixtures fail, known-good fixtures pass and generated runtime behavior matches intent.

## Expected output
A repeatable validation pipeline and policy test suite.

## Stop conditions
Stop if schema/version ambiguity prevents reliable validation or proposed gates would block critical deployments without an exception path.