# Skill: Detect Test-Double Leakage

## Purpose
Establish whether deployable code/configuration depends on test doubles, test-only namespaces, loopback/mock endpoints, fixture credentials, or test environment switches.

## Inputs
Repository root, changed files, policy, task scope, relevant build/test commands.

## Preconditions
Repository is readable and production/test path conventions are represented by policy.

## Allowed tools
Read/search, Git diff/status, scanner, non-production build/test commands.

## Process
1. Identify changed deployable modules and composition/configuration entry points.
2. Inspect nearby tests/fakes/mocks/stubs to learn conventions.
3. Run the scanner on changed files; expand to affected subtree when dynamic wiring exists.
4. Trace each finding to runtime resolution.
5. Classify as `confirmed-leakage`, `safe-production-abstraction`, `generated-or-vendor`, or `candidate-exception`.
6. For confirmed leakage, identify expected production implementation/configuration from repository evidence.
7. Record fact, evidence, confidence, component, risk, action, and approval requirement.
8. Hand confirmed findings to remediation; exceptions to owner review.

## Verification
A clean scan is not sufficient for dynamic DI/configuration; verify runtime resolution and relevant integration tests.

## Failure handling
Unresolved runtime resolution is blocking. Never suppress uncertainty merely to unblock delivery.

## Stop conditions
Permission failure, missing production source of truth, approval-required changes, or unresolved high-risk ambiguity.