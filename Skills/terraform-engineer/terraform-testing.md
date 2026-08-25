# Terraform Testing

## Purpose
Build a layered test strategy that catches Terraform defects before production while controlling cost and runtime.

## When to use
Module development, refactors, provider upgrades, policy changes, and CI hardening.

## Inputs
Configuration/modules, examples, invariants, provider credentials, test environments.

## Context to inspect
terraform test usage, static checks, policy tests, integration fixtures, cleanup behavior, CI concurrency.

## Core knowledge
Validation, static analysis, plan assertions, native Terraform tests, and real-provider integration tests catch different failure classes. Prefer the cheapest reliable layer first.

## Procedure
1. Identify critical behaviors and failure modes.
2. Add fmt/validate and static checks.
3. Test input validation and module outputs.
4. Add plan assertions for lifecycle-sensitive behavior.
5. Use isolated integration environments for provider semantics that mocks cannot prove.
6. Make test resource names collision-safe.
7. Guarantee cleanup and cost limits.
8. Run representative upgrade tests for reusable modules.

## Decision points
Use mocks for deterministic logic; use real providers for permissions, eventual consistency, and API behavior.

## Common failure patterns
Only syntax tests, brittle full-plan snapshots, shared test environments, leaked resources, and tests that never exercise upgrades.

## Verification
Tests fail when known defects are injected, pass consistently in CI, and integration cleanup leaves no resources.

## Expected output
A fast layered suite with explicit coverage of high-risk infrastructure behavior.

## Stop conditions
Stop if tests require unsafe production credentials, destructive shared resources, or cannot guarantee cleanup.