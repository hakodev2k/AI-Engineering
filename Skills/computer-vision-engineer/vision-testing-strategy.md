# Vision Testing Strategy

## Purpose
Build layered tests that catch data, geometry, preprocessing, model, post-processing, serving, and deployment regressions before production.

## When to use
Use when establishing CI/CD quality gates, changing vision code, exporting models, or preparing releases.

## Inputs
Repository, model artifacts, golden samples, metrics, deployment targets, acceptance criteria.

## Preconditions
Critical behavior and tolerances are defined.

## Context to inspect
Unit boundaries, preprocessing functions, transforms, export/runtime paths, model versions, integration interfaces, target hardware.

## Core knowledge
Vision testing needs deterministic contract tests plus statistical model evaluation. Exact tensor equality is often inappropriate across optimized runtimes; task-level tolerances matter.

## Procedure
1. Unit-test geometry, transforms, label conversions, and preprocessing.
2. Create golden samples for known critical cases.
3. Add model smoke tests for shape, finite outputs, and schema.
4. Add numerical/parity tests across export runtimes.
5. Gate releases on versioned evaluation subsets and metrics.
6. Add service contract and overload tests.
7. Run hardware-specific tests where behavior can differ.
8. Preserve failed samples as regression fixtures when reusable.

## Decision points
Exact equality vs tolerance; full benchmark vs representative CI subset; blocking gate vs warning for noisy metrics.

## Common failure patterns
Only testing training code, brittle pixel snapshots, no export parity, test leakage into model tuning, non-versioned golden data.

## Verification
Deliberately inject representative faults and confirm the appropriate test layer detects them; verify CI reproducibility.

## Expected output
Layered test plan, fixtures, quality gates, tolerance policy, and regression evidence.

## Stop conditions
Stop when acceptance thresholds are undefined or test data provenance cannot be trusted.